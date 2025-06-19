// Variáveis de estado globais
let conectado = false;
let pausado = 0;

// Função para atualizar o status visual da conexão
function atualizarStatusConexao(status, mensagem) {
    const statusElement = document.getElementById("connectionStatus");
    statusElement.textContent = mensagem;

    // Remove todas as classes de status
    statusElement.className = "connection-status";

    // Adiciona a classe correspondente ao status
    switch (status) {
        case 'waiting':
            statusElement.classList.add('waiting');
            break;
        case 'connecting':
            statusElement.classList.add('connecting');
            break;
        case 'connected':
            statusElement.classList.add('connected');
            break;
        case 'paused':
            statusElement.classList.add('paused');
            break;
        case 'error':
            statusElement.classList.add('error');
            break;
    }
}

// Função para capitalizar strings
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Função principal para conectar/desconectar a bancada
function conectarBancada() {
    const btn = document.getElementById("btnConectar");
    const ipBase = document.getElementById("ipBase").value.trim();

    if (!ipBase) {
        alert("Informe um IP base válido.");
        return;
    }

    const prefixo = ipBase.substring(0, ipBase.lastIndexOf(".") + 1);

    const ips = {
        estoque: prefixo + "10",
        processo: prefixo + "20",
        montagem: prefixo + "30",
        expedicao: prefixo + "40"
    };

    // Preenche os inputs visuais
    document.getElementById("hostIpEstoque").value = ips.estoque;
    document.getElementById("hostIpProcesso").value = ips.processo;
    document.getElementById("hostIpMontagem").value = ips.montagem;
    document.getElementById("hostIpExpedicao").value = ips.expedicao;

    if (!conectado) {
        btn.disabled = true;
        btn.textContent = "Conectando...";
        atualizarStatusConexao('connecting', "Conectando...");

        fetch("http://localhost:8081/smart/ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ips)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Erro HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(status => {
                let falha = false;

                Object.entries(status).forEach(([nome, ok]) => {
                    const inputId = `hostIp${capitalize(nome)}`;
                    const input = document.getElementById(inputId);
                    input.style.color = ok ? "rgb(0,255,0)" : "rgb(255,0,0)";
                    sessionStorage.setItem(`corFonte_${inputId}`, input.style.color);

                    if (!ok) {
                        falha = true;
                    }
                });

                if (falha) {
                    throw new Error("Falha ao conectar com uma ou mais bancadas.");
                }

                return fetch("http://localhost:8081/start-leituras", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ips)
                });
            })
            .then(() => {
                iniciarSSEClps();
                pausado = 0;

                if (pausado === 0) {
                    const inputs = document.querySelectorAll('.divBancadaStatus input');
                }

                btn.textContent = "Desconectar";
                conectado = true;
                atualizarStatusConexao('connected', "Conectado");
                
            })
            .catch(error => {
                console.error("Erro detalhado:", error);
                atualizarStatusConexao('error', "Erro na conexão");

                document.querySelectorAll('.bancada-input').forEach(input => {
                    input.style.color = "rgb(255,0,0)";
                });

                btn.textContent = "Conectar";
                conectado = false;
                sessionStorage.removeItem("bancadaConectada");
            })
            .finally(() => {
                btn.disabled = false;
            });

    } else {
        // Código para desconexão
        pararSSEClps();
        pausado = 1;
        atualizarStatusConexao('paused', "Em pausa");

        document.querySelectorAll('.bancada-input').forEach(input => {
            input.style.color = "rgb(255,255,0)";
        });

        fetch("http://localhost:8081/stop-leituras", {
            method: "POST"
        })
            .catch(error => {
                console.error("Erro ao parar leituras:", error);
            });

        btn.textContent = "Conectar";
        conectado = false;
        sessionStorage.removeItem("bancadaConectada");
    }

}

// Função para iniciar as leituras SSE
function iniciarSSEClps() {
    console.log("Leituras iniciadas");
    const dadosLidos = new Uint8Array([0x10, 0xFF, 0x00, 0xAB, 0x7E, 0x5D]);
    mostrarHexNaTela(dadosLidos);
}

// Função para parar as leituras SSE
function pararSSEClps() {
    if (window.eventSource) {
        window.eventSource.close();
        window.eventSource = null;
    }
    console.log("Conexões SSE paradas");
}


function exibirBytesHex(bytes) {
    if (!bytes || typeof bytes[0] === 'undefined') {
        console.error("Entrada inválida: esperado array de bytes");
        return "";
    }

    // Aceita Uint8Array ou array normal
    return Array.from(bytes)
        .map(byte => {
            const val = (typeof byte === 'number') ? byte : byte.charCodeAt(0);
            return val.toString(16).padStart(2, '0').toUpperCase();
        })
        .join(' ');
}

function mostrarHexNaTela(bytes) {
    const divHex = document.getElementById("saidaHex");
    if (divHex) {
        divHex.textContent = exibirBytesHex(bytes);
    }
}


// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Configura status inicial
    atualizarStatusConexao('waiting', "Aguardando solicitação de conexão");
    
    // Restaura cores dos inputs se existirem no sessionStorage
    document.querySelectorAll('.bancada-input').forEach(input => {
        const cor = sessionStorage.getItem(`corFonte_${input.id}`);
        if (cor) {
            input.style.color = cor;
        }
    });
    
    // Teste inicial para verificar se o elemento saidaHex está funcionando
    setTimeout(() => {
        mostrarHexNaTela([0x48, 0x45, 0x4C, 0x4C, 0x4F]); // "HELLO" em hex
    }, 500);
});