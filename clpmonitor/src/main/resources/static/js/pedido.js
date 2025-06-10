// Renderiza os blocos baseado no tipo selecionado
// Renderiza os blocos baseado no tipo selecionado, mantendo as informações preenchidas
function renderBlocos() {
    const tipo = document.getElementById("tipoPedido").value;
    const container = document.getElementById("blocosContainer");
    
    // Salva os valores atuais antes de limpar
    const savedValues = [];
    const existingBlocks = container.querySelectorAll('.bloco');
    
    existingBlocks.forEach((block, index) => {
        const blockNumber = index + 1;
        savedValues[blockNumber] = {
            blockColor: document.getElementById(`block-color-${blockNumber}`)?.value,
            l1Color: document.getElementById(`l1-color-${blockNumber}`)?.value,
            l2Color: document.getElementById(`l2-color-${blockNumber}`)?.value,
            l3Color: document.getElementById(`l3-color-${blockNumber}`)?.value,
            l1Pattern: document.getElementById(`l1-pattern-${blockNumber}`)?.value,
            l2Pattern: document.getElementById(`l2-pattern-${blockNumber}`)?.value,
            l3Pattern: document.getElementById(`l3-pattern-${blockNumber}`)?.value,
            isSpun: document.getElementById(`pedido-view${blockNumber}`)?.classList.contains("spin")
        };
    });

    // Limpa apenas os blocos que não serão mais necessários
    container.innerHTML = "";

    let blocos = tipo === "simples" ? 1 : tipo === "duplo" ? 2 : 3;

    for (let b = 0; b < blocos; b++) {
        const nBloco = b + 1;
        const blocoDiv = document.createElement("div");
        blocoDiv.classList.add("bloco");
        blocoDiv.id = "bloco-container-" + nBloco;
        blocoDiv.innerHTML = `
            <h2>Bloco ${nBloco}</h2>

            <div class="pedido-view" id="pedido-view${nBloco}" data-is-spun="false">
                <img class="imagem" id="bloco-${nBloco}" src="assets/bloco/rBlocoCor0.png" alt="Bloco">
                <img class="imagem" id="lamina${nBloco}-3" src="#" alt="Lâmina 3">
                <img class="imagem" id="lamina${nBloco}-1" src="#" alt="Lâmina 1">
                <img class="imagem" id="lamina${nBloco}-2" src="#" alt="Lâmina 2">
                <img class="imagem" id="padrao${nBloco}-1" src="#" alt="Padrão 1">
                <img class="imagem" id="padrao${nBloco}-2" src="#" alt="Padrão 2">
                <img class="imagem" id="padrao${nBloco}-3" src="#" alt="Padrão 3">
                <button class="spin" onclick="spin(${nBloco})">
                    <i class="material-icons">sync</i>
                </button>
            </div>
            
            <div class="input-box">
                <label for="block-color-${nBloco}">Cor do Bloco:</label>
                <select name="block-color-${nBloco}" id="block-color-${nBloco}" onchange="changePedidoView(${nBloco})">
                    <option value="">Nenhum</option>
                    <option value="preto">Preto</option>
                    <option value="vermelho">Vermelho</option>
                    <option value="azul">Azul</option>
                </select>
            </div>
            
            <div class="input-combo">
                <div class="input-box">
                    <label for="l1-color-${nBloco}">Cor Lâmina 1</label>
                    <select name="l1-color-${nBloco}" id="l1-color-${nBloco}" disabled onchange="changePedidoView(${nBloco})">
                        <option value="" hidden selected>Selecione</option>
                        <option value="1">Vermelho</option>
                        <option value="2">Azul</option>
                        <option value="3">Amarelo</option>
                        <option value="4">Verde</option>
                        <option value="5">Preto</option>
                        <option value="6">Branco</option>
                    </select>
                </div>
                <div class="input-box">
                    <label for="l1-pattern-${nBloco}">Padrão Lâmina 1</label>
                    <select name="l1-pattern-${nBloco}" id="l1-pattern-${nBloco}" disabled onchange="changePedidoView(${nBloco})">
                        <option value="" hidden selected>Selecione</option>
                        <option value="">Nenhum</option>
                        <option value="1">Casa</option>
                        <option value="2">Navio</option>
                        <option value="3">Estrela</option>
                    </select>
                </div>
            </div>
            
            <div class="input-combo">
                <div class="input-box">
                    <label for="l2-color-${nBloco}">Cor Lâmina 2</label>
                    <select name="l2-color-${nBloco}" id="l2-color-${nBloco}" disabled onchange="changePedidoView(${nBloco})">
                        <option value="" hidden selected>Selecione</option>
                        <option value="1">Vermelho</option>
                        <option value="2">Azul</option>
                        <option value="3">Amarelo</option>
                        <option value="4">Verde</option>
                        <option value="5">Preto</option>
                        <option value="6">Branco</option>
                    </select>
                </div>
                <div class="input-box">
                    <label for="l2-pattern-${nBloco}">Padrão Lâmina 2</label>
                    <select name="l2-pattern-${nBloco}" id="l2-pattern-${nBloco}" disabled onchange="changePedidoView(${nBloco})">
                        <option value="" hidden selected>Selecione</option>
                        <option value="">Nenhum</option>
                        <option value="1">Casa</option>
                        <option value="2">Navio</option>
                        <option value="3">Estrela</option>
                    </select>
                </div>
            </div>
            
            <div class="input-combo">
                <div class="input-box">
                    <label for="l3-color-${nBloco}">Cor Lâmina 3</label>
                    <select name="l3-color-${nBloco}" id="l3-color-${nBloco}" disabled onchange="changePedidoView(${nBloco})">
                        <option value="" hidden selected>Selecione</option>
                        <option value="1">Vermelho</option>
                        <option value="2">Azul</option>
                        <option value="3">Amarelo</option>
                        <option value="4">Verde</option>
                        <option value="5">Preto</option>
                        <option value="6">Branco</option>
                    </select>
                </div>
                <div class="input-box">
                    <label for="l3-pattern-${nBloco}">Padrão Lâmina 3</label>
                    <select name="l3-pattern-${nBloco}" id="l3-pattern-${nBloco}" disabled onchange="changePedidoView(${nBloco})">
                        <option value="" hidden selected>Selecione</option>
                        <option value="">Nenhum</option>
                        <option value="1">Casa</option>
                        <option value="2">Navio</option>
                        <option value="3">Estrela</option>
                    </select>
                </div>
            </div>
        `;

        container.appendChild(blocoDiv);

        // Restaura os valores salvos, se existirem
        if (savedValues[nBloco]) {
            const values = savedValues[nBloco];
            
            // Restaura cor do bloco
            if (values.blockColor) {
                document.getElementById(`block-color-${nBloco}`).value = values.blockColor;
            }
            
            // Restaura cores das lâminas
            if (values.l1Color) {
                document.getElementById(`l1-color-${nBloco}`).value = values.l1Color;
                document.getElementById(`l1-color-${nBloco}`).disabled = false;
            }
            if (values.l2Color) {
                document.getElementById(`l2-color-${nBloco}`).value = values.l2Color;
                document.getElementById(`l2-color-${nBloco}`).disabled = false;
            }
            if (values.l3Color) {
                document.getElementById(`l3-color-${nBloco}`).value = values.l3Color;
                document.getElementById(`l3-color-${nBloco}`).disabled = false;
            }
            
            // Restaura padrões das lâminas
            if (values.l1Pattern) {
                document.getElementById(`l1-pattern-${nBloco}`).value = values.l1Pattern;
                document.getElementById(`l1-pattern-${nBloco}`).disabled = !values.l1Color;
            }
            if (values.l2Pattern) {
                document.getElementById(`l2-pattern-${nBloco}`).value = values.l2Pattern;
                document.getElementById(`l2-pattern-${nBloco}`).disabled = !values.l2Color;
            }
            if (values.l3Pattern) {
                document.getElementById(`l3-pattern-${nBloco}`).value = values.l3Pattern;
                document.getElementById(`l3-pattern-${nBloco}`).disabled = !values.l3Color;
            }
            
            // Restaura estado de spin
            if (values.isSpun) {
                document.getElementById(`pedido-view${nBloco}`).classList.add("spin");
            }
            
            // Atualiza a visualização
            changePedidoView(nBloco);
        }
    }

    verBlocosMontados();
}
// Função auxiliar para renderizar os blocos do pedido
function renderBlocosPedido(blocos) {
    if (!blocos || blocos.length === 0) return '<p>Nenhum bloco neste pedido</p>';

    return blocos.map((bloco, index) => `
        <div class="bloco-info">
            <h4 class="bloco-title">
                <span class="material-symbols-rounded">category</span>
                Bloco ${index + 1} - ${bloco.cor || 'Sem cor definida'}
            </h4>
            
            ${renderLaminas(bloco.laminas)}
        </div>
    `).join('');
}

// Função auxiliar para renderizar as lâminas
function renderLaminas(laminas) {
    if (!laminas || laminas.length === 0) return '<p>Nenhuma lâmina neste bloco</p>';

    return laminas.map((lamina, index) => {
        const corClass = `lamina-color-${lamina.cor}`;
        const padraoText = getPadraoText(lamina.padrao);

        return `
            <div class="lamina-info">
                <span class="lamina-label ${corClass}">
                    <span class="material-symbols-rounded">layers</span>
                    Lâmina ${index + 1}:
                </span>
                <span class="lamina-value">
                    ${getCorText(lamina.cor)} ${padraoText}
                </span>
            </div>
        `;
    }).join('');
}

// Funções auxiliares
function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case 'concluído': return 'status-concluido';
        case 'cancelado': return 'status-cancelado';
        default: return 'status-pendente';
    }
}

function getCorText(cor) {
    const cores = {
        '1': 'Vermelho',
        '2': 'Azul',
        '3': 'Amarelo',
        '4': 'Verde',
        '5': 'Preto',
        '6': 'Branco'
    };
    return cores[cor] || 'Cor não especificada';
}

function getPadraoText(padrao) {
    if (!padrao) return '';

    const padroes = {
        '1': '(Casa)',
        '2': '(Navio)',
        '3': '(Estrela)'
    };
    return padroes[padrao] || '';
}

function verBlocosMontados() {
    const tipo = document.getElementById("tipoPedido").value;
    const andares = tipo === "simples" ? "1" : tipo === "duplo" ? "2" : "3";

    // Define a sequencia das imagens através da propriedade zIndex
    document.getElementById("divAlturaAndar1").style.zIndex = "5";
    document.getElementById("divAlturaLaminaAndar1Pos1").style.zIndex = "6";
    document.getElementById("divAlturaLaminaAndar1Pos3").style.zIndex = "7";
    document.getElementById("divAlturaLaminaAndar1Pos2").style.zIndex = "8";
    document.getElementById("divAlturaPadraoAndar1Pos1").style.zIndex = "9";
    document.getElementById("divAlturaPadraoAndar1Pos2").style.zIndex = "10";

    document.getElementById("divAlturaAndar2").style.zIndex = "11";
    document.getElementById("divAlturaLaminaAndar2Pos1").style.zIndex = "12";
    document.getElementById("divAlturaLaminaAndar2Pos3").style.zIndex = "13";
    document.getElementById("divAlturaLaminaAndar2Pos2").style.zIndex = "14";
    document.getElementById("divAlturaPadraoAndar2Pos1").style.zIndex = "15";
    document.getElementById("divAlturaPadraoAndar2Pos2").style.zIndex = "16";

    document.getElementById("divAlturaAndar3").style.zIndex = "17";
    document.getElementById("divAlturaLaminaAndar3Pos1").style.zIndex = "18";
    document.getElementById("divAlturaLaminaAndar3Pos3").style.zIndex = "19";
    document.getElementById("divAlturaLaminaAndar3Pos2").style.zIndex = "20";
    document.getElementById("divAlturaPadraoAndar3Pos1").style.zIndex = "21";
    document.getElementById("divAlturaPadraoAndar3Pos2").style.zIndex = "22";

    document.getElementById("divAlturaTampa").style.zIndex = "23";

    // Define se precisa colocar a tampa
    document.getElementById("tampa").src = andares !== "0" ? "assets/bloco/rTampa1.png" : "assets/bloco/rBlocoCor0.png";

    // Mostra todos os elementos primeiro
    const allElements = [
        "divAlturaAndar1", "divAlturaLaminaAndar1Pos1", "divAlturaLaminaAndar1Pos2", "divAlturaLaminaAndar1Pos3",
        "divAlturaPadraoAndar1Pos1", "divAlturaPadraoAndar1Pos2",
        "divAlturaAndar2", "divAlturaLaminaAndar2Pos1", "divAlturaLaminaAndar2Pos2", "divAlturaLaminaAndar2Pos3",
        "divAlturaPadraoAndar2Pos1", "divAlturaPadraoAndar2Pos2",
        "divAlturaAndar3", "divAlturaLaminaAndar3Pos1", "divAlturaLaminaAndar3Pos2", "divAlturaLaminaAndar3Pos3",
        "divAlturaPadraoAndar3Pos1", "divAlturaPadraoAndar3Pos2"
    ];

    allElements.forEach(id => {
        document.getElementById(id).style.display = 'block';
    });

    // Oculta os elementos conforme o número de andares
    switch (andares) {
        case "1":
            ["divAlturaAndar2", "divAlturaLaminaAndar2Pos1", "divAlturaLaminaAndar2Pos2", "divAlturaLaminaAndar2Pos3",
             "divAlturaPadraoAndar2Pos1", "divAlturaPadraoAndar2Pos2",
             "divAlturaAndar3", "divAlturaLaminaAndar3Pos1", "divAlturaLaminaAndar3Pos2", "divAlturaLaminaAndar3Pos3",
             "divAlturaPadraoAndar3Pos1", "divAlturaPadraoAndar3Pos2"].forEach(id => {
                document.getElementById(id).style.display = 'none';
            });
            break;

        case "2":
            ["divAlturaAndar3", "divAlturaLaminaAndar3Pos1", "divAlturaLaminaAndar3Pos2", "divAlturaLaminaAndar3Pos3",
             "divAlturaPadraoAndar3Pos1", "divAlturaPadraoAndar3Pos2"].forEach(id => {
                document.getElementById(id).style.display = 'none';
            });
            break;
    }

    // Restante do código (alturas, cores, etc.)
    var alturaimagem = document.getElementById("andar1Pedido").offsetHeight;
    var fatorMultiplicador = 0.445;

    var altura1 = "39px";
    var altura2 = 1 * fatorMultiplicador * alturaimagem + "px";
    var altura3 = 2 * fatorMultiplicador * alturaimagem + "px";
    var altura4 = 3 * fatorMultiplicador * alturaimagem + "px";

    // Define altura do top que cada imagem ira aparecer na tela
    switch (andares) {
        case "1":
            document.getElementById("divAlturaTampa").style.top = altura1;
            document.getElementById("divAlturaAndar1").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar1Pos1").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar1Pos2").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar1Pos3").style.top = altura2;
            document.getElementById("divAlturaPadraoAndar1Pos1").style.top = altura2;
            document.getElementById("divAlturaPadraoAndar1Pos2").style.top = altura2;
            break;

        case "2":
            document.getElementById("divAlturaTampa").style.top = altura1;
            document.getElementById("divAlturaAndar1").style.top = altura3;
            document.getElementById("divAlturaLaminaAndar1Pos1").style.top = altura3;
            document.getElementById("divAlturaLaminaAndar1Pos2").style.top = altura3;
            document.getElementById("divAlturaLaminaAndar1Pos3").style.top = altura3;
            document.getElementById("divAlturaPadraoAndar1Pos1").style.top = altura3;
            document.getElementById("divAlturaPadraoAndar1Pos2").style.top = altura3;

            document.getElementById("divAlturaAndar2").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar2Pos1").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar2Pos2").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar2Pos3").style.top = altura2;
            document.getElementById("divAlturaPadraoAndar2Pos1").style.top = altura2;
            document.getElementById("divAlturaPadraoAndar2Pos2").style.top = altura2;
            break;

        case "3":
            document.getElementById("divAlturaTampa").style.top = altura1;
            document.getElementById("divAlturaAndar1").style.top = altura4;
            document.getElementById("divAlturaLaminaAndar1Pos1").style.top = altura4;
            document.getElementById("divAlturaLaminaAndar1Pos2").style.top = altura4;
            document.getElementById("divAlturaLaminaAndar1Pos3").style.top = altura4;
            document.getElementById("divAlturaPadraoAndar1Pos1").style.top = altura4;
            document.getElementById("divAlturaPadraoAndar1Pos2").style.top = altura4;

            document.getElementById("divAlturaAndar2").style.top = altura3;
            document.getElementById("divAlturaLaminaAndar2Pos1").style.top = altura3;
            document.getElementById("divAlturaLaminaAndar2Pos2").style.top = altura3;
            document.getElementById("divAlturaLaminaAndar2Pos3").style.top = altura3;
            document.getElementById("divAlturaPadraoAndar2Pos1").style.top = altura3;
            document.getElementById("divAlturaPadraoAndar2Pos2").style.top = altura3;

            document.getElementById("divAlturaAndar3").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar3Pos1").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar3Pos2").style.top = altura2;
            document.getElementById("divAlturaLaminaAndar3Pos3").style.top = altura2;
            document.getElementById("divAlturaPadraoAndar3Pos1").style.top = altura2;
            document.getElementById("divAlturaPadraoAndar3Pos2").style.top = altura2;
            break;
    }

    // Define as cores dos blocos conforme seleção do usuário
    for (let blocoNum = 1; blocoNum <= 3; blocoNum++) {
        const blocoEl = document.getElementById(`block-color-${blocoNum}`);
        if (blocoEl && blocoEl.value) {
            const corId = blocoEl.value === "preto" ? 1 :
                blocoEl.value === "vermelho" ? 2 : 3;
            document.getElementById(`andar${blocoNum}Pedido`).src = `assets/bloco/rBlocoCor${corId}.png`;
        }
    }

    // CORREÇÃO PARA A SEÇÃO DE LÂMINAS E PADRÕES
    for (let blocoNum = 1; blocoNum <= 3; blocoNum++) {
        // Primeiro reseta todos os padrões deste bloco/andar
        for (let pos = 1; pos <= 2; pos++) {
            document.getElementById(`padrao${pos}andar${blocoNum}Pedido`).src =
                `assets/padroes/padrao0-${pos}.png`;
        }

        // Agora aplica as seleções atuais
        for (let pos = 1; pos <= 3; pos++) {
            const laminaEl = document.getElementById(`l${pos}-color-${blocoNum}`);

            // Atualiza lâminas
            if (laminaEl && laminaEl.value) {
                document.getElementById(`pos${pos}andar${blocoNum}Pedido`).src =
                    `assets/laminas/lamina${pos}-${laminaEl.value}.png`;

                // Atualiza padrões apenas se houver lâmina selecionada
                if (pos <= 2) {
                    const padraoEl = document.getElementById(`l${pos}-pattern-${blocoNum}`);
                    if (padraoEl && padraoEl.value) {
                        document.getElementById(`padrao${pos}andar${blocoNum}Pedido`).src =
                            `assets/padroes/padrao${padraoEl.value}-${pos}.png`;
                    }
                }
            }
        }
    }
}

// Atualiza a visualização do pedido
function changePedidoView(id) {
    const blockColor = document.getElementById("block-color-" + id).value;

    if (blockColor !== "") {
        const idCor = (blockColor === "preto" ? 1 : blockColor === "vermelho" ? 2 : 3);
        document.getElementById("bloco-" + id).src = "assets/bloco/rBlocoCor" + idCor + ".png";

        // Habilita os selects de cor
        ["l1-color-", "l2-color-", "l3-color-"].forEach(prefix => {
            document.getElementById(prefix + id).disabled = false;
        });

        const l1Color = document.getElementById("l1-color-" + id).value;
        const l2Color = document.getElementById("l2-color-" + id).value;
        const l3Color = document.getElementById("l3-color-" + id).value;

        const l1Pattern = document.getElementById("l1-pattern-" + id).value;
        const l2Pattern = document.getElementById("l2-pattern-" + id).value;
        const l3Pattern = document.getElementById("l3-pattern-" + id).value;

        const view = document.getElementById("pedido-view" + id);
        const isSpun = view.classList.contains("spin");

        // Atualiza as lâminas e padrões
        if (isSpun) {
            document.getElementById("lamina" + id + "-3").src = l1Color ? "assets/laminas/lamina3-" + l1Color + ".png" : "#";
            document.getElementById("lamina" + id + "-1").src = l3Color ? "assets/laminas/lamina1-" + l3Color + ".png" : "#";
            document.getElementById("padrao" + id + "-2").src = l3Pattern ? "assets/padroes/padrao" + l3Pattern + "-1.png" : "#";
            document.getElementById("padrao" + id + "-1").src = "#";
        } else {
            document.getElementById("lamina" + id + "-1").src = l1Color ? "assets/laminas/lamina1-" + l1Color + ".png" : "#";
            document.getElementById("lamina" + id + "-3").src = l3Color ? "assets/laminas/lamina3-" + l3Color + ".png" : "#";
            document.getElementById("padrao" + id + "-1").src = l1Pattern ? "assets/padroes/padrao" + l1Pattern + "-1.png" : "#";
            document.getElementById("padrao" + id + "-3").src = "#";
        }

        // Atualiza lâmina/padrão do meio
        document.getElementById("lamina" + id + "-2").src = l2Color ? "assets/laminas/lamina2-" + l2Color + ".png" : "#";
        document.getElementById("padrao" + id + "-2").src = l2Pattern ? "assets/padroes/padrao" + l2Pattern + "-2.png" : "#";

        // Habilita os padrões caso uma cor esteja selecionada
        ["l1-pattern-", "l2-pattern-", "l3-pattern-"].forEach((prefix, index) => {
            const color = [l1Color, l2Color, l3Color][index];
            document.getElementById(prefix + id).disabled = !color;
        });
    }

    verBlocosMontados();
}

// Gira o pedido (espelha as lâminas/padrões 1 e 3)
function spin(id) {
    const view = document.getElementById("pedido-view" + id);
    view.classList.toggle("spin");
    changePedidoView(id); // Atualiza a visualização após girar
}

// Envia pedido para a base de dados
function enviarPedido() {
    const tipo = document.getElementById("tipoPedido").value;
    const blocos = document.querySelectorAll(".bloco");

    const pedido = {
        tipo: tipo,
        blocos: [],
        status: "pendente", // Status inicial
        data: new Date().toISOString() // Data atual
    };

    blocos.forEach((bloco, index) => {
        const numBloco = index + 1;

        const blocoColorElement = document.getElementById("block-color-" + numBloco);
        const corBloco = blocoColorElement ? blocoColorElement.value : null;

        if (!blocoColorElement) {
            console.warn(`Elemento block-color-${numBloco} não encontrado`);
        }

        const laminas = [];

        for (let i = 1; i <= 3; i++) {
            const corElement = document.getElementById(`l${i}-color-${numBloco}`);
            const padraoElement = document.getElementById(`l${i}-pattern-${numBloco}`);

            const cor = corElement ? corElement.value : null;
            const padrao = padraoElement ? padraoElement.value : null;

            if (!corElement) {
                console.warn(`Elemento l${i}-color-${numBloco} não encontrado`);
            }
            if (!padraoElement) {
                console.warn(`Elemento l${i}-pattern-${numBloco} não encontrado`);
            }

            // Só adiciona se a cor da lâmina estiver definida
            if (cor) {
                laminas.push({
                    cor: cor,
                    padrao: padrao || null
                });
            }
        }

        // Só adiciona blocos válidos
        if (corBloco) {
            pedido.blocos.push({
                cor: corBloco,
                laminas: laminas
            });
        }
    });

    // Verifica se pelo menos um bloco foi adicionado
    if (pedido.blocos.length === 0) {
        alert("Por favor, adicione pelo menos um bloco válido ao pedido.");
        return;
    }

    // Envia o pedido
    fetch("/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([pedido]) // envia um array contendo 1 pedido
    })
    .then(res => {
        if (res.ok) {
            alert("Pedido enviado com sucesso!");
            window.location.href = "/listaPedido"; // Redireciona para a lista de pedidos
        } else {
            return res.json().then(err => {
                throw new Error(err.message || "Erro ao enviar pedido");
            });
        }
    })
    .catch(err => {
        alert(err.message || "Erro ao enviar pedido");
        console.error("Erro:", err);
    });
}


function listaPedidos() {
    const listaContainer = document.getElementById("listaPedidos");

    // Verificação de segurança: impede erro se o elemento não existe na página atual
    if (!listaContainer) {
        console.warn("Elemento 'listaPedidos' não encontrado no DOM.");
        return;
    }

    fetch("/store/orders")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar pedidos");
            }
            return response.json();
        })
        .then(data => {
            listaContainer.innerHTML = "";

            if (!data || data.length === 0) {
                listaContainer.innerHTML = `
                    <div class="empty-message">
                        <span class="material-symbols-rounded">inbox</span>
                        <p>Nenhum pedido encontrado</p>
                    </div>
                `;
                return;
            }

            // Ordena do mais recente para o mais antigo
            data.sort((a, b) => new Date(b.data) - new Date(a.data));

            data.forEach((pedido, index) => {
                const pedidoDiv = document.createElement("div");
                pedidoDiv.classList.add("pedido-card");

                const dataFormatada = pedido.data ?
                    new Date(pedido.data).toLocaleString('pt-BR') :
                    'Data não disponível';

                pedidoDiv.innerHTML = `
                    <div class="pedido-header">
                        <h3 class="pedido-title">Pedido #${index + 1}</h3>
                        <span class="pedido-id">Tipo: ${pedido.tipo || 'Não especificado'}</span>
                    </div>
                    
                    <div class="pedido-info">
                        <div class="info-item">
                            <span class="material-symbols-rounded">calendar_today</span>
                            <span>${dataFormatada}</span>
                        </div>
                    </div>
                    
                    ${renderBlocosPedido(pedido.blocos)}
                    
                    <div class="pedido-footer">
                        <span class="pedido-status ${getStatusClass(pedido.status)}">
                            ${pedido.status || 'pendente'}
                        </span>
                    </div>
                `;

                listaContainer.appendChild(pedidoDiv);
            });
        })
        .catch(err => {
            console.error("Erro:", err);
            listaContainer.innerHTML = `
                <div class="empty-message error">
                    <span class="material-symbols-rounded">error</span>
                    <p>${err.message || 'Erro ao carregar pedidos'}</p>
                </div>
            `;
        });
}

// Inicializa a página
window.onload = function () {
    renderBlocos();
    verBlocosMontados();
    listaPedidos();
};