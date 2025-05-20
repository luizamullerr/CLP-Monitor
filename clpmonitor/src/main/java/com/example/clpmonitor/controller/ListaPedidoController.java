package com.example.clpmonitor.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.clpmonitor.model.Pedido;
import com.example.clpmonitor.repository.PedidoRepository;

@Controller
public class ListaPedidoController {



    @Autowired
    private PedidoRepository pedidoRepository;

    @GetMapping("/listaPedido")
    public String pedidos(Model model) {
        List<Pedido> pedidos = pedidoRepository.findAll();
        model.addAttribute("listaPedido", pedidos);
        return "listaPedido";
 
    }
    @GetMapping("/store/orders")
    @ResponseBody
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    @DeleteMapping("/api/pedidos/{id}")
    @ResponseBody
    public String excluirPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isPresent()) {
            pedidoRepository.deleteById(id);
            return "DELETADO";
        }
        return "NAO ENCONTRADO";
    }
}