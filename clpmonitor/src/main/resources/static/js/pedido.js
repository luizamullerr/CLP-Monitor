// Renderiza os blocos baseado no tipo selecionado
function renderBlocos() {
    const tipo = document.getElementById("tipoPedido").value;
    const container = document.getElementById("blocosContainer");
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

        verBlocosMontados();
    }
}
function verBlocosMontados() {
    const tipo = document.getElementById("tipoPedido").value;
    let andares = tipo === "simples" ? 1 : tipo === "duplo" ? 2 : 3;

    // Alturas fixas baseadas nas suas imagens (ajuste conforme necessário)
    const alturas = {
        tampa: 40,    // altura da tampa em pixels
        bloco: 80,   // altura de um bloco em pixels
        sobreposicao: 15 // quanto cada bloco deve invadir o bloco abaixo
    };

    // Esconde todos os andares primeiro
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`divAlturaAndar${i}`).style.display = 'none';
        document.getElementById(`divAlturaLaminaAndar${i}Pos1`).style.display = 'none';
        document.getElementById(`divAlturaLaminaAndar${i}Pos2`).style.display = 'none';
        document.getElementById(`divAlturaLaminaAndar${i}Pos3`).style.display = 'none';
        document.getElementById(`divAlturaPadraoAndar${i}Pos1`).style.display = 'none';
        document.getElementById(`divAlturaPadraoAndar${i}Pos2`).style.display = 'none';
    }

    // Mostra a tampa
    document.getElementById("divAlturaTampa").style.display = 'block';
    document.getElementById("tampa").src = "assets/bloco/rTampa1.png";

    // Configura z-index (ordem de empilhamento)
    const zIndexValues = {
        tampa: 100,
        andar1: 90,
        andar2: 80,
        andar3: 70,
        laminas: 95,
        padroes: 97
    };

    document.getElementById("divAlturaTampa").style.zIndex = zIndexValues.tampa;

    // Posiciona cada andar com sobreposição (agora em ordem normal 1, 2, 3)
    let posicaoTop = alturas.tampa - alturas.sobreposicao; // Começa com a tampa

    for (let i = 1; i <= andares; i++) {
        // Mostra o andar atual
        document.getElementById(`divAlturaAndar${i}`).style.display = 'block';
        document.getElementById(`divAlturaLaminaAndar${i}Pos1`).style.display = 'block';
        document.getElementById(`divAlturaLaminaAndar${i}Pos2`).style.display = 'block';
        document.getElementById(`divAlturaLaminaAndar${i}Pos3`).style.display = 'block';
        document.getElementById(`divAlturaPadraoAndar${i}Pos1`).style.display = 'block';
        document.getElementById(`divAlturaPadraoAndar${i}Pos2`).style.display = 'block';

        // Configura z-index
        document.getElementById(`divAlturaAndar${i}`).style.zIndex = zIndexValues[`andar${i}`];
        document.getElementById(`divAlturaLaminaAndar${i}Pos1`).style.zIndex = zIndexValues.laminas;
        document.getElementById(`divAlturaLaminaAndar${i}Pos2`).style.zIndex = zIndexValues.laminas;
        document.getElementById(`divAlturaLaminaAndar${i}Pos3`).style.zIndex = zIndexValues.laminas;
        document.getElementById(`divAlturaPadraoAndar${i}Pos1`).style.zIndex = zIndexValues.padroes;
        document.getElementById(`divAlturaPadraoAndar${i}Pos2`).style.zIndex = zIndexValues.padroes;

        // Posiciona o andar
        document.getElementById(`divAlturaAndar${i}`).style.top = `${posicaoTop}px`;
        document.getElementById(`divAlturaLaminaAndar${i}Pos1`).style.top = `${posicaoTop}px`;
        document.getElementById(`divAlturaLaminaAndar${i}Pos2`).style.top = `${posicaoTop}px`;
        document.getElementById(`divAlturaLaminaAndar${i}Pos3`).style.top = `${posicaoTop}px`;
        document.getElementById(`divAlturaPadraoAndar${i}Pos1`).style.top = `${posicaoTop}px`;
        document.getElementById(`divAlturaPadraoAndar${i}Pos2`).style.top = `${posicaoTop}px`;

        // Atualiza a posição para o próximo andar
        posicaoTop += alturas.bloco + alturas.sobreposicao;
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

    // Define as lâminas conforme seleção do usuário
    for (let blocoNum = 1; blocoNum <= 3; blocoNum++) {
        for (let pos = 1; pos <= 3; pos++) {
            const laminaEl = document.getElementById(`l${pos}-color-${blocoNum}`);
            if (laminaEl && laminaEl.value) {
                document.getElementById(`pos${pos}andar${blocoNum}Pedido`).src = 
                    `assets/laminas/lamina${pos}-${laminaEl.value}.png`;
            }
            
            if (pos <= 2) {
                const padraoEl = document.getElementById(`l${pos}-pattern-${blocoNum}`);
                if (padraoEl && padraoEl.value) {
                    document.getElementById(`padrao${pos}andar${blocoNum}Pedido`).src = 
                        `assets/padroes/rpadrao${pos}-${padraoEl.value}.png`;
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
            document.getElementById("padrao" + id + "-3").src = l3Pattern ? "assets/padroes/padrao" + l3Pattern + "-1.png" : "#";
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

    } else {
        // Desabilita todos os campos e limpa imagens
        ["l1-color-", "l2-color-", "l3-color-", "l1-pattern-", "l2-pattern-", "l3-pattern-"].forEach(prefix => {
            document.getElementById(prefix + id).disabled = true;
            document.getElementById(prefix + id).value = "";
        });

        document.getElementById("bloco-" + id).src = "assets/bloco/rBlocoCor0.png";

        ["lamina", "padrao"].forEach(prefix => {
            for (let i = 1; i <= 3; i++) {
                document.getElementById(prefix + id + "-" + i).src = "#";
            }
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
        blocos: []
    };

    blocos.forEach((bloco, index) => {
        const numBloco = index + 1;
        const corBloco = document.getElementById("block-color-" + numBloco).value;

        const laminas = [];

        // Captura as cores e padrões das lâminas
        const cores = [
            document.getElementById("l1-color-" + numBloco).value,
            document.getElementById("l2-color-" + numBloco).value,
            document.getElementById("l3-color-" + numBloco).value
        ];

        const padroes = [
            document.getElementById("l1-pattern-" + numBloco).value,
            document.getElementById("l2-pattern-" + numBloco).value,
            document.getElementById("l3-pattern-" + numBloco).value
        ];

        for (let i = 0; i < 3; i++) {
            laminas.push({
                cor: cores[i],
                padrao: padroes[i]
            });
        }

        pedido.blocos.push({
            cor: corBloco,
            laminas: laminas
        });
    });

    fetch("/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([pedido])
    }).then(res => {
        if (res.ok) {
            alert("Pedido enviado com sucesso!");
            listarPedidos();
        } else {
            alert("Erro ao enviar pedido.");
        }
    });
}

function listarPedidos() {
    fetch("/store/orders")
        .then(response => response.json())
        .then(data => {
            const listaContainer = document.getElementById("listaPedidos");
            listaContainer.innerHTML = "";

            if (data.length === 0) {
                listaContainer.innerHTML = `
                    <div class="empty-message">
                        <span class="material-symbols-rounded">inbox</span>
                        <p>Nenhum pedido encontrado</p>
                    </div>
                `;
                return;
            }

            data.forEach((pedido, index) => {
                const pedidoDiv = document.createElement("div");
                pedidoDiv.classList.add("pedido-card");
                pedidoDiv.style.animationDelay = `${index * 0.1}s`;
                
                // Formatando a data (se existir no pedido)
                const dataPedido = pedido.data ? new Date(pedido.data).toLocaleString() : 'Data não disponível';
                
                // Criando o HTML do card
                pedidoDiv.innerHTML = `
                    <div class="pedido-header">
                        <h3 class="pedido-title">Pedido #${index + 1}</h3>
                        <span class="pedido-id">${pedido.tipo || 'Tipo não especificado'}</span>
                    </div>
                    
                    <div class="pedido-info">
                        <div class="info-item">
                            <span class="material-symbols-rounded">calendar_today</span>
                            <span>${dataPedido}</span>
                        </div>
                    </div>
                    
                    ${renderBlocosPedido(pedido.blocos)}
                    
                    <div class="pedido-footer">
                        <span class="pedido-status ${getStatusClass(pedido.status)}">
                            ${pedido.status || 'pendente'}
                        </span>
                        <div class="pedido-actions">
                            <button class="action-btn" title="Detalhes">
                                <span class="material-symbols-rounded">visibility</span>
                            </button>
                            <button class="action-btn" title="Editar">
                                <span class="material-symbols-rounded">edit</span>
                            </button>
                        </div>
                    </div>
                `;

                listaContainer.appendChild(pedidoDiv);
            });
        })
        .catch(() => {
            const listaContainer = document.getElementById("listaPedidos");
            listaContainer.innerHTML = `
                <div class="empty-message error">
                    <span class="material-symbols-rounded">error</span>
                    <p>Erro ao carregar pedidos</p>
                </div>
            `;
        });
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
// Inicializa a página
window.onload = function() {
    renderBlocos();
    listarPedidos();
};