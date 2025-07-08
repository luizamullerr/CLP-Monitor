package com.example.clpmonitor.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        // Adicione quaisquer atributos necessários ao modelo
        return "home"; // Isso deve corresponder ao nome do arquivo sem extensão
    }
}