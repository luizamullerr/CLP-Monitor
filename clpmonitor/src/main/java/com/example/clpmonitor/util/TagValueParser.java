//------------------------------------------------------------------------------------------
// Atualização de Eventos do Backend para o Frontend utilizando SSE - Server Sent Events
// Curso Técnico em Desenvolvimento de Sistemas - SENAI Timbó -SC
// UC: Desenvolvimento de Sistemas
// Docente: Gerson Trindade         SET-2024
//------------------------------------------------------------------------------------------
package com.example.clpmonitor.util;

public class TagValueParser {

    public static Object parseValue(String value, String type) {
        try {
            return switch (type.toUpperCase()) {
                case "INTEGER" -> Integer.parseInt(value);
                case "FLOAT"   -> Float.parseFloat(value);
                case "BYTE"    -> Byte.parseByte(value);
                case "BIT"     -> Integer.parseInt(value); // ou Boolean.parseBoolean(value)
                case "STRING", "BLOCK" -> value;
                default -> throw new IllegalArgumentException("Tipo de dado não suportado: " + type);
            };
        } catch (Exception e) {
            throw new RuntimeException("Erro ao converter valor: " + value + " para o tipo: " + type, e);
        }
    }
}
