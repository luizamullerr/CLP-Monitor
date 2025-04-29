package com.example.clpmonitor.controller;

import com.example.clpmonitor.model.Tag;
import com.example.clpmonitor.model.TagReadRequest;
import com.example.clpmonitor.model.TagWriteRequest;
import com.example.clpmonitor.service.ClpSimulatorService;
import com.example.clpmonitor.service.PlcConnector;
import com.example.clpmonitor.model.BlockUpdateRequest;
import com.example.clpmonitor.service.BlockService;

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

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("tag", new TagWriteRequest());
        return "index";
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

    @Autowired
    private BlockService blockService; // Injetar o novo serviço

    @PostMapping("/update-block")
    public String updateBlock(@ModelAttribute BlockUpdateRequest blockRequest, Model model) {
        try {
            blockService.updateBlock(blockRequest);
            model.addAttribute("mensagem", "Bloco atualizado com sucesso!");
        } catch (Exception e) {
            model.addAttribute("erro", "Erro ao atualizar bloco: " + e.getMessage());
        }
        model.addAttribute("block", new BlockUpdateRequest()); // Limpar o form
        return "index"; // ou para onde você quiser voltar
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
            // Exibindo as informações de leitura
            System.out.println("\nLendo do CLP: " + request.getIp() +
                    "\n | DB: " + request.getDb() +
                    "\n | Offset: " + request.getOffset() +
                    "\n | Tipo: " + request.getTipo() + "\n");

            Object resultado = null;

            // Leitura do tipo de dado
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

            // Retorna o valor lido como resposta
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

    // Método para converter byte[] para String hexadecimal
    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            hexString.append(String.format("%02X", b));
        }
        return hexString.toString();
    }
}
