package com.example.clpmonitor.controller;

import java.beans.PropertyEditorSupport;
import java.io.IOException;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.clpmonitor.model.DbBlock;
import com.example.clpmonitor.model.Estoque;
import com.example.clpmonitor.model.Expedicao;
import com.example.clpmonitor.model.PlcReaderTask;
import com.example.clpmonitor.model.Tag;
import com.example.clpmonitor.model.TagReadRequest;
import com.example.clpmonitor.model.TagWriteRequest;
import com.example.clpmonitor.repository.EstoqueRepository;
import com.example.clpmonitor.service.ClpSimulatorService;
import com.example.clpmonitor.service.ClpSimulatorService.PlcConnectionManager;
import static com.example.clpmonitor.service.ClpSimulatorService.atualizarCache;
import com.example.clpmonitor.service.DbBlockService;
import com.example.clpmonitor.service.ExpedicaoService;
import com.example.clpmonitor.service.PlcConnector;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class ClpController {

    @Autowired
    private ClpSimulatorService simulatorService;

    @Autowired
    private DbBlockService dbBlockService;

    @Autowired
    private ExpedicaoService expedicaoService;

    @Autowired
    private EstoqueRepository estoqueRepository;

   

    private final Map<String, Future<?>> leituraFutures = new ConcurrentHashMap<>();

    private final ScheduledExecutorService leituraExecutor = Executors.newScheduledThreadPool(4);

    public static List<Integer> dadosClp1;
    public static List<Integer> dadosClp2;
    public static List<Integer> dadosClp3;
    public static List<Integer> dadosClp4;

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
                case "STRING" -> success = plc.writeString(tag.getDb(), tag.getOffset(), tag.getSize(), tag.getValue().trim());
                case "BLOCK" -> {
                    byte[] bytes = PlcConnector.hexStringToByteArray(tag.getValue().trim());
                    success = plc.writeBlock(tag.getDb(), tag.getOffset(), tag.getSize(), bytes);
                }
                case "FLOAT" -> success = plc.writeFloat(tag.getDb(), tag.getOffset(), Float.parseFloat(tag.getValue().trim()));
                case "INTEGER" -> success = plc.writeInt(tag.getDb(), tag.getOffset(), Integer.parseInt(tag.getValue().trim()));
                case "BYTE" -> success = plc.writeByte(tag.getDb(), tag.getOffset(), Byte.parseByte(tag.getValue().trim()));
                case "BIT" -> {
                    if (tag.getBitNumber() == null) {
                        throw new IllegalArgumentException("Bit Number é obrigatório para tipo BIT");
                    }
                    success = plc.writeBit(tag.getDb(), tag.getOffset(), tag.getBitNumber(),
                            Boolean.parseBoolean(tag.getValue().trim()));
                }
                default -> throw new IllegalArgumentException("Tipo não suportado: " + tag.getType());
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

            Object resultado;

            switch (request.getTipo().toLowerCase()) {
                case "string" -> resultado = plc.readString(request.getDb(), request.getOffset(), request.getSize());
                case "block" -> {
                    byte[] block = plc.readBlock(request.getDb(), request.getOffset(), request.getSize());
                    resultado = bytesToHex(block);
                }
                case "float" -> resultado = plc.readFloat(request.getDb(), request.getOffset());
                case "integer" -> resultado = plc.readInt(request.getDb(), request.getOffset());
                case "byte" -> resultado = plc.readByte(request.getDb(), request.getOffset());
                case "boolean" -> resultado = plc.readBit(request.getDb(), request.getOffset(), request.getBitNumber());
                default -> {
                    return ResponseEntity.badRequest().body("Tipo de dado não suportado");
                }
            }

            plc.disconnect();
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
    public String getBlockPage(Model model) {
    model.addAttribute("block", new DbBlock());

    // Lista os DbBlocks ordenados
    model.addAttribute("blocos", dbBlockService.listarBlocosOrdenados());
    

    // Lista a expedição (Expedicao) com storageId = 2
    short storageExpedicao = 2;
    List<Expedicao> blocosExpedicao = expedicaoService.listarPorStorageId(storageExpedicao);
    model.addAttribute("blocosExpedicao", blocosExpedicao);

    // ✅ Adiciona os dados de estoque
    List<Estoque> estoqueList = estoqueRepository.findAll(); // ou estoqueService se preferir
    model.addAttribute("estoqueList", estoqueList);

    return "block";
}

@PostMapping("/block")
public String salvarMultiplosBlocos(@RequestParam("blocos") String[] blocosJson) throws Exception {
    ObjectMapper mapper = new ObjectMapper();
    List<DbBlock> blocos = new ArrayList<>();

    for (String json : blocosJson) {
        DbBlock bloco = mapper.readValue(json, DbBlock.class);
        blocos.add(bloco);
    }

    for (DbBlock bloco : blocos) {
        dbBlockService.cadastrarBloco(bloco);
    }

    return "redirect:/block";
}
public class DbBlockListWrapper {
    private List<DbBlock> blocos;  // trocar para 'blocos'

    public List<DbBlock> getBlocos() {
        return blocos;
    }

    public void setBlocos(List<DbBlock> blocos) {
        this.blocos = blocos;
    }
}

@PostMapping("/block/expedicao")
public String salvarBlockEExpedicao(
    @ModelAttribute("block") DbBlock bloco,
    @RequestParam Map<String, String> productionOrders,
    @RequestParam Map<String, String> positions) {

    if (bloco != null && bloco.getPosition() != null) {
        dbBlockService.cadastrarBloco(bloco);
    }

    if (productionOrders != null && positions != null) {
        // Substitua seu loop antigo por esse:
        for (String posStr : positions.values()) {
            if (posStr == null || posStr.isEmpty()) {
                continue; // Ignora valores vazios
            }

            int pos;
            try {
                pos = Integer.parseInt(posStr);
            } catch (NumberFormatException e) {
                continue; // Ignora posições inválidas
            }

            String opStr = productionOrders.get(posStr);
            Integer numeroOp = null;

            if (opStr != null && !opStr.isEmpty()) {
                try {
                    numeroOp = Integer.parseInt(opStr);
                } catch (NumberFormatException e) {
                    numeroOp = null; // Ignora OP inválida
                }
            }

            Expedicao existente = expedicaoService.buscarPorPosicaoEStorageId(pos, (short) 2);
            if (existente == null) {
                existente = new Expedicao();
                existente.setPosicao(pos);
                existente.setStorageId((short) 2);
            }
            existente.setNumeroOp(numeroOp);
            existente.setStatus(1);

            expedicaoService.salvar(existente);
        }
    }

    return "redirect:/block";
}


    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            hexString.append(String.format("%02X", b));
        }
        return hexString.toString();
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(Short.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) {
                if (text == null || text.trim().isEmpty()) {
                    setValue((short) 0);
                } else {
                    setValue(Short.parseShort(text));
                }
            }
        });
    }

    @PostMapping("/smart/ping") // Endpoint completo será /api/smart/ping
    public ResponseEntity<Map<String, Boolean>> pingHosts(@RequestBody Map<String, String> ips) {
        Map<String, Boolean> resultados = new HashMap<>();
        try {
            ips.forEach((nome, ip) -> {
                try {
                    boolean online = InetAddress.getByName(ip).isReachable(2000);
                    resultados.put(nome, online);
                } catch (IOException e) {
                    resultados.put(nome, false);
                }
            });
            return ResponseEntity.ok(resultados);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/start-leituras")
    public ResponseEntity<String> startLeituras(@RequestBody Map<String, String> ips) {
        ips.forEach((nome, ip) -> {
            if (!leituraFutures.containsKey(nome)) {
                PlcConnector plcConnector = PlcConnectionManager.getConexao(ip);
                if (plcConnector == null) {
                    System.err.println("Erro ao obter conexão com o CLP: " + ip);
                    return; // ignora esse CLP e continua com os demais
                }

                PlcReaderTask task = null;
                switch (nome.toLowerCase()) {
                    case "estoque" -> task = new PlcReaderTask(plcConnector, nome, 9, 0, 111, dados -> {
                        ClpController.dadosClp1 = dados;
                        ClpSimulatorService.clpEstoque(ip, dados);
                        atualizarCache("estoque", dados);
                    });
                    case "processo" -> task = new PlcReaderTask(plcConnector, nome, 2, 0, 9, dados -> {
                        ClpController.dadosClp2 = dados;
                        ClpSimulatorService.clpProcesso(ip, dados);
                        atualizarCache("processo", dados);
                    });
                    case "montagem" -> task = new PlcReaderTask(plcConnector, nome, 57, 0, 9, dados -> {
                        ClpController.dadosClp3 = dados;
                        ClpSimulatorService.clpMontagem(ip, dados);
                        atualizarCache("montagem", dados);
                    });
                    case "expedicao" -> task = new PlcReaderTask(plcConnector, nome, 9, 0, 48, dados -> {
                        ClpController.dadosClp4 = dados;
                        ClpSimulatorService.clpExpedicao(ip, dados);
                        atualizarCache("expedicao", dados);
                    });
                    default -> {
                        System.err.println("Nome de CLP inválido: " + nome);
                        return;
                    }
                }

                if (task != null) {
                    ScheduledFuture<?> future = leituraExecutor.scheduleAtFixedRate(task, 0, 800, TimeUnit.MILLISECONDS);
                    leituraFutures.put(nome, future);
                }
            }
        });

        return ResponseEntity.ok("Leituras com PlcReaderTask iniciadas.");
    }

    @PostMapping("/stop-leituras")
    public ResponseEntity<String> stopLeituras() {
        leituraFutures.forEach((nome, future) -> {
            future.cancel(true);
            System.out.println("Thread de leitura '" + nome + "' cancelada.");
        });
        leituraFutures.clear();
        PlcConnectionManager.encerrarTodasAsConexoes();
        return ResponseEntity.ok("Leituras interrompidas.");
    }
}
