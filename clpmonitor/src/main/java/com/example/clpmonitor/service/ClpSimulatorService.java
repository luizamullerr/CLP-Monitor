package com.example.clpmonitor.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.clpmonitor.model.ClpData;

import jakarta.annotation.PostConstruct;

@Service
public class ClpSimulatorService {

    public static byte[] indexColorEst = new byte[28];
    public Integer indexExpedition;

    public PlcConnector plcEstDb9;
    public PlcConnector plcExpDb9;

    // Lista dos clientes conectados via SSE
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(2);

    // Cache estático para os dados
    private static final Map<String, List<Integer>> cacheDados = new ConcurrentHashMap<>();

    @PostConstruct
    public void startSimulation() {
        // Você pode agendar tarefas aqui se quiser
        sendClp1Update();
        sendClp4Update();
    }

    public void atualizarEstoque() {
        sendClp1Update();
    }

    public void atualizarExpedicao() {
        sendClp4Update();
    }

    // Inscrição SSE
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }

    // Envia dados CLP1 (Estoque)
    public void sendClp1Update() {

        plcEstDb9 = new PlcConnector("10.74.241.10", 102);
        try {
            plcEstDb9.connect();
            indexColorEst = plcEstDb9.readBlock(9, 68, 28);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Falha ao ler CLP Estoque");
        }

        List<Integer> byteArray = new ArrayList<>();
        for (int i = 0; i < 28; i++) {
            int color = (int) indexColorEst[i];
            byteArray.add(color);
        }

        ClpData clp1 = new ClpData(1, byteArray);
        sendToEmitters("clp1-data", clp1);
    }

    // Envia dados CLP4 (Expedição)
    public void sendClp4Update() {

        int[] values = new int[12];

        plcExpDb9 = new PlcConnector("10.74.241.40", 102);
        try {
            plcExpDb9.connect();

            int j = 0;
            for (int i = 6; i <= 28; i += 2) {
                values[j] = plcExpDb9.readInt(9, i);
                j++;
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Falha ao ler CLP Expedição");
        }

        List<Integer> byteArray = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            byteArray.add(values[i]);
        }

        ClpData clp4 = new ClpData(4, byteArray);
        sendToEmitters("clp4-data", clp4);
    }

    private void sendToEmitters(String eventName, ClpData clpData) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(clpData));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }

    // Métodos estáticos para uso pelo PlcReaderTask e outros
    public static void clpEstoque(String ip, List<Integer> dados) {
        System.out.println("Estou na função do Estoque");
        // Coloque a lógica que quiser para o estoque aqui
    }

    public static void clpProcesso(String ip, List<Integer> dados) {
        System.out.println("Estou na função do Processo");
        // Coloque a lógica que quiser para o processo aqui
    }

    public static void clpMontagem(String ip, List<Integer> dados) {
        System.out.println("Estou na função de Montagem");
        // Coloque a lógica que quiser para montagem aqui
    }

    public static void clpExpedicao(String ip, List<Integer> dados) {
        System.out.println("Estou na função de Expedição");
        // Coloque a lógica que quiser para expedição aqui
    }
    
    public static void atualizarCache(String ip, List<Integer> dados) {
        
    }

    // Classe interna para gerenciar conexões com CLPs
    public static class PlcConnectionManager {

        private static final Map<String, PlcConnector> conexoes = new ConcurrentHashMap<>();

        public static synchronized PlcConnector getConexao(String ip) {
            PlcConnector connector = conexoes.get(ip);
            if (connector == null) {
                System.out.println("=============================");
                System.out.println("NOVA CONEXÃO COM O CLP: " + ip);
                System.out.println("=============================");
                connector = new PlcConnector(ip, 102);
                try {
                    connector.connect();
                    conexoes.put(ip, connector);
                } catch (Exception e) {
                    System.err.println("Erro ao conectar ao CLP " + ip);
                    e.printStackTrace();
                    return null;
                }
            }
            return connector;
        }

        public static synchronized void desconectar(String ip) {
            PlcConnector connector = conexoes.get(ip);
            if (connector != null) {
                try {
                    connector.disconnect();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                conexoes.remove(ip);
            }
        }

        public static void encerrarTodasAsConexoes() {
            System.out.println("=============================");
            System.out.println("ENCERRAR CONEXÕES COM OS CLPs");
            System.out.println("=============================");
            for (Map.Entry<String, PlcConnector> entry : conexoes.entrySet()) {
                String ip = entry.getKey();
                PlcConnector connector = entry.getValue();
                try {
                    if (connector != null) {
                        connector.disconnect();
                    }
                } catch (Exception e) {
                    System.err.println("Erro ao encerrar conexão com " + ip + ": " + e.getMessage());
                }
            }
            conexoes.clear();
        }
    }
}
