// Variáveis de estado globais
let conectado = false;
let pausado = false;

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

// Função para salvar o estado atual no localStorage
function salvarEstado() {
    const estado = {
        conectado: conectado,
        pausado: pausado,
        ipBase: document.getElementById("ipBase").value,
        status: document.getElementById("connectionStatus").textContent,
        ips: {
            estoque: document.getElementById("hostIpEstoque").value,
            processo: document.getElementById("hostIpProcesso").value,
            montagem: document.getElementById("hostIpMontagem").value,
            expedicao: document.getElementById("hostIpExpedicao").value
        },
        cores: {
            estoque: document.getElementById("hostIpEstoque").style.color,
            processo: document.getElementById("hostIpProcesso").style.color,
            montagem: document.getElementById("hostIpMontagem").style.color,
            expedicao: document.getElementById("hostIpExpedicao").style.color
        }
    };
    localStorage.setItem("estadoBancada", JSON.stringify(estado));
}

// Função para carregar o estado do localStorage
function carregarEstado() {
    const estadoSalvo = localStorage.getItem("estadoBancada");
    if (estadoSalvo) {
        return JSON.parse(estadoSalvo);
    }
    return null;
}

// Variáveis globais de controle


// Função para atualizar status visual (exemplo)
function atualizarStatusConexao(status, mensagem) {
    const statusEl = document.getElementById("statusConexao");
    if (!statusEl) return;
    statusEl.textContent = mensagem;
    statusEl.className = "status-" + status; // para usar CSS diferente se quiser
}

// Função para salvar estado da bancada no localStorage
function salvarEstado() {
    const estado = {
        conectado,
        pausado,
        ipBase: document.getElementById("ipBase").value.trim(),
        ips: {
            estoque: document.getElementById("hostIpEstoque").value,
            processo: document.getElementById("hostIpProcesso").value,
            montagem: document.getElementById("hostIpMontagem").value,
            expedicao: document.getElementById("hostIpExpedicao").value
        },
        cores: {
            estoque: document.getElementById("hostIpEstoque").style.color,
            processo: document.getElementById("hostIpProcesso").style.color,
            montagem: document.getElementById("hostIpMontagem").style.color,
            expedicao: document.getElementById("hostIpExpedicao").style.color
        }
    };
    localStorage.setItem("estadoBancada", JSON.stringify(estado));
    // Marca também que está conectado, para facilitar check
    localStorage.setItem("bancadaConectada", conectado ? "true" : "false");
}

// Função para carregar estado salvo
function carregarEstado() {
    const json = localStorage.getItem("estadoBancada");
    if (!json) return null;
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

// Função para atualizar a interface (inputs, botão, status) com o estado carregado
function restaurarEstado() {
    const estado = carregarEstado();
    if (!estado) return;

    conectado = estado.conectado || false;
    pausado = estado.pausado || false;

    document.getElementById("ipBase").value = estado.ipBase || "";

    document.getElementById("hostIpEstoque").value = estado.ips?.estoque || "";
    document.getElementById("hostIpProcesso").value = estado.ips?.processo || "";
    document.getElementById("hostIpMontagem").value = estado.ips?.montagem || "";
    document.getElementById("hostIpExpedicao").value = estado.ips?.expedicao || "";

    document.getElementById("hostIpEstoque").style.color = estado.cores?.estoque || "";
    document.getElementById("hostIpProcesso").style.color = estado.cores?.processo || "";
    document.getElementById("hostIpMontagem").style.color = estado.cores?.montagem || "";
    document.getElementById("hostIpExpedicao").style.color = estado.cores?.expedicao || "";

    const btn = document.getElementById("btnConectar");

    if (conectado && !pausado) {
        btn.textContent = "Desconectar";
        atualizarStatusConexao('connected', "Conectado");
        iniciarSSEClps();
    } else if (conectado && pausado) {
        btn.textContent = "Desconectar";
        atualizarStatusConexao('paused', "Em pausa");
    } else {
        btn.textContent = "Conectar";
        atualizarStatusConexao('waiting', "Aguardando conexão");
    }
}

// Função para conectar/desconectar bancadas (sua função principal)
function conectarBancada() {
    const btn = document.getElementById("btnConectar");
    const ipBase = document.getElementById("ipBase").value.trim();

    if (!ipBase) {
        console.error("Informe um IP base válido.");
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
                if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
                return res.json();
            })
            .then(status => {
                let falha = false;

                Object.entries(status).forEach(([nome, ok]) => {
                    const inputId = `hostIp${capitalize(nome)}`;
                    const input = document.getElementById(inputId);
                    input.style.color = ok ? "rgb(0,255,0)" : "rgb(255,0,0)";
                    if (!ok) falha = true;
                });

                if (falha) throw new Error("Falha ao conectar com uma ou mais bancadas.");

                return fetch("http://localhost:8081/start-leituras", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ips)
                });
            })
            .then(() => {
                iniciarSSEClps();
                pausado = false;
                conectado = true;
                btn.textContent = "Desconectar";

                salvarEstado();
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
                pausado = false;
                localStorage.removeItem("estadoBancada");
            })
            .finally(() => {
                btn.disabled = false;
            });

    } else {
        // Desconectar ou pausar
        if (pausado) {
            // Desconecta completamente
            pararSSEClps();
            btn.textContent = "Conectar";
            conectado = false;
            pausado = false;
            atualizarStatusConexao('waiting', "Aguardando conexão");
            localStorage.removeItem("estadoBancada");
        } else {
            // Pausa
            pararSSEClps();
            pausado = true;
            btn.textContent = "Desconectar";
            atualizarStatusConexao('paused', "Em pausa");
            salvarEstado();
        }

        document.querySelectorAll('.bancada-input').forEach(input => {
            input.style.color = pausado ? "rgb(255,255,0)" : "rgb(255,0,0)";
        });

        fetch("http://localhost:8081/stop-leituras", {
            method: "POST"
        }).catch(error => {
            console.error("Erro ao parar leituras:", error);
        });
    }
}

// Função para iniciar as leituras SSE
function iniciarSSEClps() {
    console.log("Leituras iniciadas");
    // Sua lógica real para iniciar SSE aqui
}

// Função para parar as leituras SSE
function pararSSEClps() {
    if (window.eventSource) {
        window.eventSource.close();
        window.eventSource = null;
    }
    console.log("Conexões SSE paradas");
}

// Funções auxiliares
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Chamar a restauração do estado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    restaurarEstado();
});


function exibirBytesHex(bytes) {
    if (!bytes || typeof bytes[0] === 'undefined') {
        console.error("Entrada inválida: esperado array de bytes");
        return "";
    }

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
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se é o primeiro acesso (não há estado salvo)
    const primeiroAcesso = !localStorage.getItem("estadoBancada");
    
    if (primeiroAcesso) {
        // Estado inicial para primeiro acesso
        atualizarStatusConexao('waiting', "Aguardando conexão");
        document.getElementById("btnConectar").textContent = "Conectar";
        conectado = false;
        pausado = false;
        return;
    }

    // Carrega o estado salvo
    const estado = carregarEstado();
    if (estado) {
        // Restaura os valores dos IPs
        document.getElementById("ipBase").value = estado.ipBase || "";
        document.getElementById("hostIpEstoque").value = estado.ips.estoque || "";
        document.getElementById("hostIpProcesso").value = estado.ips.processo || "";
        document.getElementById("hostIpMontagem").value = estado.ips.montagem || "";
        document.getElementById("hostIpExpedicao").value = estado.ips.expedicao || "";

        // Restaura as cores
        document.getElementById("hostIpEstoque").style.color = estado.cores.estoque || "";
        document.getElementById("hostIpProcesso").style.color = estado.cores.processo || "";
        document.getElementById("hostIpMontagem").style.color = estado.cores.montagem || "";
        document.getElementById("hostIpExpedicao").style.color = estado.cores.expedicao || "";

        // Restaura o estado da conexão
        conectado = estado.conectado;
        pausado = estado.pausado;
        
        const btn = document.getElementById("btnConectar");
        if (conectado && !pausado) {
            btn.textContent = "Desconectar";
            atualizarStatusConexao('connected', "Conectado");
            iniciarSSEClps();
        } else if (conectado && pausado) {
            btn.textContent = "Desconectar";
            atualizarStatusConexao('paused', "Em pausa");
        } else {
            btn.textContent = "Conectar";
            atualizarStatusConexao('waiting', "Aguardando conexão");
        }
    } else {
        // Estado padrão se não houver estado salvo
        atualizarStatusConexao('waiting', "Aguardando conexão");
        document.getElementById("btnConectar").textContent = "Conectar";
    }
});
window.onload = () => {
    const bancadaConectada = localStorage.getItem("bancadaConectada");
    if (bancadaConectada === "true") {
        const ipsJson = localStorage.getItem("ips");
        if (ipsJson) {
            const ips = JSON.parse(ipsJson);
            // Atualize inputs visuais, chame funções, etc
            document.getElementById("hostIpEstoque").value = ips.estoque;
            document.getElementById("hostIpProcesso").value = ips.processo;
            document.getElementById("hostIpMontagem").value = ips.montagem;
            document.getElementById("hostIpExpedicao").value = ips.expedicao;
            // Talvez chamar conectar automaticamente, ou atualizar UI para estado conectado
        }
    }
};

// ... (mantidas as funções executarPedido e corParaInt do código anterior)

// Funções relacionadas a pedidos (mantidas para compatibilidade)
function executarPedido() {
    const tipo = document.getElementById("tipoPedido").value;
    const ipClp = document.getElementById("hostIpEstoque").value;

    if (!ipClp) {
        alert("Por favor, informe o IP do CLP.");
        return;
    }
     // Verifica conexão
     if (!conectado || pausado) {
        throw new Error("Conecte-se à bancada primeiro");
    }

    let blocosCount = tipo === "simples" ? 1 : tipo === "duplo" ? 2 : 3;
    let blocos = [];

    for (let b = 1; b <= blocosCount; b++) {
        const corInput = document.getElementById(`block-color-${b}`);
        let cor = 3; // Padrão: azul
        if (corInput.value === "preto") {
            cor = 1;
        } else if (corInput.value === "vermelho") {
            cor = 2;
        }
    
        let bloco = {
            andar: b,
            cor: cor,
            laminas: []
        };
    
        for (let l = 1; l <= 3; l++) {
            const corLam = document.getElementById(`l${l}-color-${b}`).value;
            const padrao = document.getElementById(`l${l}-pattern-${b}`).value;
    
            bloco.laminas.push({
                numero: l,
                cor: corParaInt(corLam),
                padrao: parseInt(padrao)
            });
        }
    
        blocos.push(bloco);
    }

    const pedidoDTO = {
        tipo: tipo,
        ipClp: ipClp,
        blocos: blocos
    };
    console.log("Executando pedido para IP CLP:", ipClp);
    fetch("http://localhost:8081/iniciar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoDTO)
    })
    .then(response => {
        if (response.ok) {
            alert("Pedido executado com sucesso!");
        } else {
            alert("Erro ao executar pedido.");
            response.text().then(text => console.error("Erro resposta:", text));
        }
    })
    .catch(error => {
        console.error("Erro na requisição:", error);
        alert("Erro na comunicação com o servidor.");
    });
    
}

function corParaInt(cor) {
    switch (cor.toLowerCase()) {
        case "vermelho": return 1;
        case "azul": return 2;
        case "amarelo": return 3;
        case "verde": return 4;
        case "preto": return 5;
        case "branco": return 6;
        default: return 0;
    }
}