package com.example.clpmonitor.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.clpmonitor.dto.PedidoDTO;
import com.example.clpmonitor.model.Bloco;
import com.example.clpmonitor.model.Lamina;
import com.example.clpmonitor.model.Pedido;
import com.example.clpmonitor.repository.PedidoRepository;


    
@Controller
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @GetMapping("/loja-pedido")
    public String pedidos(Model model) {
        List<Pedido> pedidos = pedidoRepository.findAll();
        model.addAttribute("loja-pedido", pedidos);
        return "loja-pedido";
    }

    @PostMapping("/store/orders")
    @ResponseBody
    public  String receberPedidos(@RequestBody List<PedidoDTO> pedidosDto) {
        System.out.println("PEDIDOS: "+ pedidosDto.size());
        for (int i = 0; i < pedidosDto.size(); i++) {
            PedidoDTO pedidoDTO = pedidosDto.get(i);

            Pedido pedido = new Pedido();
            pedido.setTipo(pedidoDTO.getTipo());

            List<Bloco> blocos = pedidoDTO.getBlocos().stream().map(blocoDTO -> {
                Bloco bloco = new Bloco();
                bloco.setCor(String.valueOf(blocoDTO.getCor()));
                bloco.setPedido(pedido);

                List<Lamina> laminas = blocoDTO.getLaminas().stream().map(laminaDTO -> {
                    Lamina lamina = new Lamina();
                    lamina.setCor(String.valueOf(laminaDTO.getCor())); // converter int para String aqui
                    lamina.setPadrao(String.valueOf(laminaDTO.getPadrao()));
                    lamina.setBloco(bloco);
                    return lamina;
                }).collect(Collectors.toList());

                bloco.setLaminas(laminas);
                return bloco;
            }).collect(Collectors.toList());

            pedido.setBlocos(blocos);

            pedidoRepository.save(pedido); // salva tudo em cascata

            // Impressão no console
            System.out.println("=== Pedido " + (i + 1) + " ===");
            System.out.println("Tipo: " + pedido.getTipo());

            for (int b = 0; b < pedido.getBlocos().size(); b++) {
                Bloco bloco = pedido.getBlocos().get(b);
                System.out.println("  Bloco " + (b + 1));
                System.out.println("    Cor do Bloco: " + bloco.getCor());

                List<Lamina> laminas = bloco.getLaminas();
                for (int l = 0; l < laminas.size(); l++) {
                    Lamina lamina = laminas.get(l);
                    System.out.println("      Lâmina " + (l + 1));
                    System.out.println("        Cor: " + lamina.getCor());
                    System.out.println("        Padrão: " + lamina.getPadrao());
                }
            }
        }
        return "OK";
    }

   
    
    
}
