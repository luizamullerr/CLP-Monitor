package com.example.clpmonitor.service;

import java.util.ArrayList;
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
        Integer posicao = exp.getPosicao();
        System.out.println("💾 Tentando salvar: posição = " + posicao + ", OP = " + exp.getNumeroOp());

        if (posicao == null || posicao < 1 || posicao > 12) {
            throw new IllegalArgumentException("A posição deve estar entre 1 e 12.");
        }

        if (exp.getStorageId() == null) {
            throw new IllegalArgumentException("StorageId não pode ser nulo");
        }

        expedicaoRepository.save(exp);
        System.out.println("💾 Salvou no banco: " + exp);
    }

    public void atualizarExpedicao(List<Expedicao> expedicaoList) {
        System.out.println("♻️ Atualizando todas as posições da expedição...");

        // Limpa todas as posições no banco
        expedicaoRepository.deleteAll();

        // Cria uma lista completa com as 12 posições
        List<Expedicao> listaCompleta = new ArrayList<>();

        for (short i = 1; i <= 12; i++) {
            final short posicao = i;

            // Busca na lista recebida se existe posição i
            Expedicao expedicao = expedicaoList.stream()
                .filter(e -> e.getPosicao() != null && e.getPosicao() == posicao)
                .findFirst()
                .orElse(null);

            if (expedicao == null) {
                expedicao = new Expedicao();
                expedicao.setNumeroOp(0); // valor default
            } else if (expedicao.getNumeroOp() == null) {
                expedicao.setNumeroOp(0); // ou valor padrão para indicar vazio
            }

            expedicao.setPosicao((int) posicao);

            if (expedicao.getStorageId() == null) {
                expedicao.setStorageId((short) 1); // ou outro valor padrão, ou levanta erro se obrigatório
            }

            listaCompleta.add(expedicao);
        }

        expedicaoRepository.saveAll(listaCompleta);
        System.out.println("✅ Atualização concluída com sucesso.");
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
