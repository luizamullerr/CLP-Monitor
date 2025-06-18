package com.example.clpmonitor.model;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

import com.example.clpmonitor.service.PlcConnector;

/**
 * Tarefa responsável por ler dados de um CLP periodicamente.
 */
public class PlcReaderTask implements Runnable {

    private final PlcConnector plcConnector;
    private final String nomeClp;
    private final int db;
    private final int start;
    private final int length;
    private final Consumer<List<Integer>> callback;

    public PlcReaderTask(
            PlcConnector plcConnector,
            String nomeClp,
            int db,
            int start,
            int length,
            Consumer<List<Integer>> callback
    ) {
        this.plcConnector = plcConnector;
        this.nomeClp = nomeClp;
        this.db = db;
        this.start = start;
        this.length = length;
        this.callback = callback;
    }

    @Override
    public void run() {
        try {
            byte[] bytes = plcConnector.readBlock(db, start, length);
            List<Integer> dados = new ArrayList<>();
            for (byte b : bytes) {
                dados.add(b & 0xFF);
            }
            callback.accept(dados);
        } catch (Exception e) {
            System.err.println("Erro ao ler dados do CLP '" + nomeClp + "': " + e.getMessage());
        }
    }
}