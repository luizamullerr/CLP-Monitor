// Variáveis de estado globais
let conectado = false;
let pausado = 0;

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
                alert("Falha ao conectar com uma ou mais bancadas.");
                document.querySelectorAll('.bancada-input').forEach(input => {
                    input.style.color = "rgb(255,0,0)";
                });
                btn.textContent = "Conectar";
                conectado = false;
                sessionStorage.removeItem("bancadaConectada");
                return; // não segue para start-leituras
            }

            // Inicia as leituras
            return fetch("http://localhost:8081/start-leituras", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ips)
            })
            .then(() => {
                iniciarSSEClps();
                pausado = 0;

                btn.textContent = "Desconectar";
                conectado = true;
                sessionStorage.setItem("bancadaConectada", "true");
            });
        })
        .catch(error => {
            console.error("Erro detalhado:", error);
            alert("Erro ao conectar: " + error.message);

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

function iniciarSSEClps() {
    console.log("Leituras iniciadas");
}

function pararSSEClps() {
    if (window.eventSource) {
        window.eventSource.close();
        window.eventSource = null;
    }
    console.log("Conexões SSE paradas");
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
