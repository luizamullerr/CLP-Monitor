function renderBlocos() {
    const tipoPedidoEl = document.getElementById("tipoPedido");
    const container = document.getElementById("blocosContainer");

    if (!tipoPedidoEl || !container) {
        console.warn("Elemento 'tipoPedido' ou 'blocosContainer' não encontrado no DOM.");
        return;
    }

    const tipo = tipoPedidoEl.value;
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


        if (savedValues[nBloco]) {
            const values = savedValues[nBloco];


            if (values.blockColor) {
                document.getElementById(`block-color-${nBloco}`).value = values.blockColor;
            }


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

            if (values.isSpun) {
                document.getElementById(`pedido-view${nBloco}`).classList.add("spin");
            }

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
    const tipoPedidoEl = document.getElementById("tipoPedido");

    if (!tipoPedidoEl) {
        console.warn("Elemento 'tipoPedido' não encontrado no DOM.");
        return;
    }

    const tipo = tipoPedidoEl.value;
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


    document.getElementById("tampa").src = andares !== "0" ? "assets/bloco/rTampa1.png" : "assets/bloco/rBlocoCor0.png";

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


    var alturaimagem = document.getElementById("andar1Pedido").offsetHeight;
    var fatorMultiplicador = 0.445;

    var altura1 = "39px";
    var altura2 = 1 * fatorMultiplicador * alturaimagem + "px";
    var altura3 = 2 * fatorMultiplicador * alturaimagem + "px";
    var altura4 = 3 * fatorMultiplicador * alturaimagem + "px";


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

    for (let blocoNum = 1; blocoNum <= 3; blocoNum++) {
        for (let pos = 1; pos <= 2; pos++) {
            const padraoEl = document.getElementById(`padrao${pos}andar${blocoNum}Pedido`);
            if (padraoEl) {
                padraoEl.src = `assets/padroes/padrao0-${pos}.png`;
                padraoEl.style.filter = "invert(0)"; // Reset do filtro
            }
        }

        for (let pos = 1; pos <= 3; pos++) {
            const laminaEl = document.getElementById(`l${pos}-color-${blocoNum}`);
            const laminaImgEl = document.getElementById(`pos${pos}andar${blocoNum}Pedido`);

            if (laminaEl && laminaEl.value && laminaImgEl) {
                laminaImgEl.src = `assets/laminas/lamina${pos}-${laminaEl.value}.png`;


                if (pos <= 2) {
                    const padraoEl = document.getElementById(`padrao${pos}andar${blocoNum}Pedido`);
                    const padraoSelectEl = document.getElementById(`l${pos}-pattern-${blocoNum}`);

                    if (padraoEl && padraoSelectEl && padraoSelectEl.value) {
                        padraoEl.src = `assets/padroes/padrao${padraoSelectEl.value}-${pos}.png`;

                        // Aplica o filtro invert se a cor da lâmina for 5 (como na função changePadraoVir)
                        if (laminaEl.value == 5) {
                            padraoEl.style.filter = "invert(1)";
                        } else {
                            padraoEl.style.filter = "invert(0)";
                        }
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

        if (isSpun) {
            document.getElementById("lamina" + id + "-3").src = l1Color ? "assets/laminas/lamina3-" + l1Color + ".png" : "#";
            document.getElementById("lamina" + id + "-1").src = l3Color ? "assets/laminas/lamina1-" + l3Color + ".png" : "#";

            const padrao2 = document.getElementById("padrao" + id + "-2");
            padrao2.src = l3Pattern ? "assets/padroes/padrao" + l3Pattern + "-1.png" : "#";

            // Aplica filtro invert se a cor correspondente for 5
            padrao2.style.filter = (l3Color == 5) ? "invert(1)" : "invert(0)";

            document.getElementById("padrao" + id + "-1").src = "#";
        } else {
            document.getElementById("lamina" + id + "-1").src = l1Color ? "assets/laminas/lamina1-" + l1Color + ".png" : "#";
            document.getElementById("lamina" + id + "-3").src = l3Color ? "assets/laminas/lamina3-" + l3Color + ".png" : "#";

            const padrao1 = document.getElementById("padrao" + id + "-1");
            padrao1.src = l1Pattern ? "assets/padroes/padrao" + l1Pattern + "-1.png" : "#";

            // Aplica filtro invert se a cor correspondente for 5
            padrao1.style.filter = (l1Color == 5) ? "invert(1)" : "invert(0)";

            document.getElementById("padrao" + id + "-3").src = "#";
        }

        const padrao2 = document.getElementById("padrao" + id + "-2");
        document.getElementById("lamina" + id + "-2").src = l2Color ? "assets/laminas/lamina2-" + l2Color + ".png" : "#";
        padrao2.src = l2Pattern ? "assets/padroes/padrao" + l2Pattern + "-2.png" : "#";

        // Aplica filtro invert se a cor correspondente for 5
        padrao2.style.filter = (l2Color == 5) ? "invert(1)" : "invert(0)";

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
    changePedidoView(id);
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
        body: JSON.stringify([pedido])
    })
        .then(res => {
            if (res.ok) {
                alert("Pedido enviado com sucesso!");
                window.location.href = "/listaPedido";
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
                        <button class="excluir-btn" data-id="${pedido.id}">Excluir</button>
                    </div>
                `;

                listaContainer.appendChild(pedidoDiv);
            });
            document.querySelectorAll(".excluir-btn").forEach(button => {
                button.addEventListener("click", () => {
                    const pedidoId = button.getAttribute("data-id");
                    excluirPedido(pedidoId);
                });
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
function excluirPedido(id) {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    fetch(`/api/pedidos/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao excluir pedido");
            }
            listaPedidos();
        })
        .catch(err => {
            console.error("Erro ao excluir:", err);
            alert("Falha ao excluir o pedido.");
        });
}

document.addEventListener("DOMContentLoaded", function () {
    renderBlocos();
    verBlocosMontados();
    listaPedidos();
});