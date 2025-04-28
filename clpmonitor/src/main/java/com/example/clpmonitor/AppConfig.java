package com.example.clpmonitor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.clpmonitor.service.S7Client;

@Configuration
public class AppConfig {

    @Bean
    public S7Client s7Client() {
        return new S7Client("localhost", 0); // ou outro IP do seu CLP ou simulação
    }
}