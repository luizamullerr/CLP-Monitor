function conectarBancada() {
    const btn = document.getElementById("btnConectar");
    const ipBase = document.getElementById("ipBase").value.trim(); // Ex: "192.168.0.0"
    const prefixo = ipBase.substring(0, ipBase.lastIndexOf(".") + 1); // Ex: "192.168.0."

    const ips = {
        estoque: prefixo + "10",
        processo: prefixo + "30",
        montagem: prefixo + "40",
        expedicao: prefixo + "50"
    };

    // Preenche os inputs visuais
    document.getElementById("hostIpEstoque").value = ips.estoque;
    document.getElementById("hostIpProcesso").value = ips.processo;
    document.getElementById("hostIpMontagem").value = ips.montagem;
    document.getElementById("hostIpExpedicao").value = ips.expedicao;

    if (!conectado) {
        fetch("/smart/ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ips)
        })
            .then(res => res.json())
            .then(status => {
                Object.entries(status).forEach(([nome, ok]) => {
                    const inputId = `hostIp${capitalize(nome)}`;
                    const input = document.getElementById(inputId);
                    const cor = ok ? "rgb(0,255,0)" : "rgb(255,0,0)";
                    input.style.color = cor;
                    sessionStorage.setItem(`corFonte_${inputId}`, cor);
                });

                return fetch("/start-leituras", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ips)
                });
            })
            .then(() => {
                iniciarSSEClps();
                pausado = 0;
                if (pausado === 0) {
                    const inputs = document.querySelectorAll('.bancada-input');
                    inputs.forEach(input => {
                        input.style.color = "rgb(0,255,0)";
                    });
                }
            })
            .catch(error => {
                console.error("Erro ao conectar:", error);
            });

        btn.textContent = "Desconectar";
        conectado = true;
        sessionStorage.setItem("bancadaConectada", "true");
    } else {
        pararSSEClps();

        if (pausado === 0) {
            pausado = 1;
        }
        if (pausado === 1) {
            const inputs = document.querySelectorAll('.bancada-input');
            inputs.forEach(input => {
                input.style.color = "rgb(255,255,0)";
            });
        }

        fetch("/stop-leituras", { method: "POST" });

        clps.forEach(clp => {
            document.getElementById(`${clp}-dados`).textContent = "--";
        });

        ["Estoque", "Processo", "Montagem", "Expedicao"].forEach(nome => {
            document.getElementById(`leitura${nome}`).value = "--";
        });

        btn.textContent = "Conectar";
        conectado = false;
        sessionStorage.removeItem("bancadaConectada");
    }
    
}

// Função auxiliar
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
