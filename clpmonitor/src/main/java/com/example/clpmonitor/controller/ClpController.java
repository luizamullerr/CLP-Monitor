package com.example.clpmonitor.controller;

import com.example.clpmonitor.model.DbBlock;
import com.example.clpmonitor.model.Tag;
import com.example.clpmonitor.model.TagReadRequest;
import com.example.clpmonitor.model.TagWriteRequest;
import com.example.clpmonitor.service.ClpSimulatorService;
import com.example.clpmonitor.service.DbBlockService;
import com.example.clpmonitor.service.PlcConnector;

import java.io.IOException;
import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Controller
public class ClpController {

    @Autowired
    private ClpSimulatorService simulatorService;

    @Autowired
    private DbBlockService dbBlockService;

    @GetMapping("/monitor")
    public String monitor(Model model) {
        model.addAttribute("contentPage", "fragments/monitor :: monitor");
        model.addAttribute("tag", new Tag());
        return "monitor";
    }
    
    @GetMapping("/atualizar-estoque")
    @ResponseBody
    public void atualizarEstoque() {
        simulatorService.atualizarEstoque();
    }

    @GetMapping("/atualizar-expedicao")
    @ResponseBody
    public void atualizarExpedicao() {
        simulatorService.atualizarExpedicao();
    }

    @GetMapping("/clp-data-stream")
    public SseEmitter streamClpData() {
        return simulatorService.subscribe();
    }

    @PostMapping("/updateSimulation")
    public String startSimulation() {
        simulatorService.startSimulation();
        return "redirect:/fragmento-formulario";
    }

    @PostMapping("/write-tag")
    public String writeTag(@ModelAttribute Tag tag, Model model) {
        try {
            PlcConnector plc = new PlcConnector(tag.getIp().trim(), tag.getPort());
            plc.connect();

            boolean success = false;

            switch (tag.getType().toUpperCase()) {
                case "STRING":
                    success = plc.writeString(tag.getDb(), tag.getOffset(), tag.getSize(), tag.getValue().trim());
                    break;
                case "BLOCK":
                    byte[] bytes = PlcConnector.hexStringToByteArray(tag.getValue().trim());
                    success = plc.writeBlock(tag.getDb(), tag.getOffset(), tag.getSize(), bytes);
                    break;
                case "FLOAT":
                    success = plc.writeFloat(tag.getDb(), tag.getOffset(), Float.parseFloat(tag.getValue().trim()));
                    break;
                case "INTEGER":
                    success = plc.writeInt(tag.getDb(), tag.getOffset(), Integer.parseInt(tag.getValue().trim()));
                    break;
                case "BYTE":
                    success = plc.writeByte(tag.getDb(), tag.getOffset(), Byte.parseByte(tag.getValue().trim()));
                    break;
                case "BIT":
                    if (tag.getBitNumber() == null) {
                        throw new IllegalArgumentException("Bit Number é obrigatório para tipo BIT");
                    }
                    success = plc.writeBit(tag.getDb(), tag.getOffset(), tag.getBitNumber(),
                            Boolean.parseBoolean(tag.getValue().trim()));
                    break;
                default:
                    throw new IllegalArgumentException("Tipo não suportado: " + tag.getType());
            }

            plc.disconnect();

            if (success) {
                model.addAttribute("mensagem", "Escrita no CLP realizada com sucesso!");
            } else {
                model.addAttribute("erro", "Erro de escrita no CLP!");
            }
        } catch (Exception ex) {
            model.addAttribute("erro", "Erro: " + ex.getMessage());
        }

        return "index";
    }

    @PostMapping("/read-tag")
    @ResponseBody
    public ResponseEntity<?> readTag(@RequestBody TagReadRequest request) {
        try {
            PlcConnector plc = new PlcConnector(request.getIp(), request.getPorta());
            plc.connect();
            System.out.println("\nLendo do CLP: " + request.getIp() +
                    "\n | DB: " + request.getDb() +
                    "\n | Offset: " + request.getOffset() +
                    "\n | Tipo: " + request.getTipo() + "\n");

            Object resultado = null;

            switch (request.getTipo().toLowerCase()) {
                case "string":
                    resultado = plc.readString(request.getDb(), request.getOffset(), request.getSize());
                    break;
                case "block":
                    byte[] block = plc.readBlock(request.getDb(), request.getOffset(), request.getSize());
                    resultado = bytesToHex(block);
                    break;
                case "float":
                    resultado = plc.readFloat(request.getDb(), request.getOffset());
                    break;
                case "integer":
                    resultado = plc.readInt(request.getDb(), request.getOffset());
                    break;
                case "byte":
                    resultado = plc.readByte(request.getDb(), request.getOffset());
                    break;
                case "boolean":
                    resultado = plc.readBit(request.getDb(), request.getOffset(), request.getBitNumber());
                    break;
                default:
                    return ResponseEntity.badRequest().body("Tipo de dado não suportado");
            }

            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao ler valor: " + e.getMessage());
        }
    }

    @GetMapping("/fragmento-formulario")
    public String carregarFragmentoFormulario(Model model) {
        model.addAttribute("tag", new TagWriteRequest());
        return "fragments/formulario :: clp-write-fragment";
    }

    @GetMapping("/block")
    public String home(Model model) {
        model.addAttribute("block", new DbBlock());
        return "block";
    }

    @PostMapping("/block")
    public String salvarBlock(@ModelAttribute("block") DbBlock tag) {
        System.out.println("Salvando: " + tag.getPosition() + ", cor: " + tag.getColor() + ", storage: " + tag.getStorageId());
        dbBlockService.cadastrarBloco(tag); // Usa o service com lógica de update
        return "redirect:/block";
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            hexString.append(String.format("%02X", b));
        }
        return hexString.toString();
    }
    
@PostMapping("/smart/ping")
    public Map<String, Boolean> pingHosts(@RequestBody Map<String, String> ips) {
        Map<String, Boolean> resultados = new HashMap<>();
        ips.forEach((nome, ip) -> {
            try {
                boolean online = InetAddress.getByName(ip).isReachable(2000);
                resultados.put(nome, online);
            } catch (IOException e) {
                resultados.put(nome, false);
            }
        });
        return resultados;
    }


}