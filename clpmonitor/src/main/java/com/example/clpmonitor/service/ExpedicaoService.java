package com.example.clpmonitor.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.clpmonitor.model.Expedicao;
import com.example.clpmonitor.repository.ExpedicaoRepository;

@Service
public class ExpedicaoService {

    @Autowired
    private ExpedicaoRepository expedicaoRepository;

    public Expedicao buscarPorPosicaoEStorageId(int posicao, short storageId) {
        return expedicaoRepository.findByStorageIdAndPosicao(storageId, posicao).orElse(null);
    }

    public void salvar(Expedicao exp) {
        expedicaoRepository.save(exp);
    }

    public List<Expedicao> listarPorStorageId(short storageId) {
        List<Expedicao> blocos = expedicaoRepository.findByStorageId(storageId);

        for (int i = 1; i <= 12; i++) {
            final int pos = i;
            boolean exists = blocos.stream().anyMatch(b -> b.getPosicao() == pos);
            if (!exists) {
                Expedicao vazio = new Expedicao(pos, null, 0);
                vazio.setStorageId(storageId);
                blocos.add(vazio);
            }
        }

        blocos.sort(Comparator.comparing(Expedicao::getPosicao));
        return blocos;
    }
}

