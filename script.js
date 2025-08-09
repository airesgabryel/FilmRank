// --- Início da Lógica do "Banco de Dados" Local ---

// A lista inicial de filmes. Só será usada na primeira vez que o usuário abrir o site.
const filmesIniciais = [
    { id: 1, titulo: "Interestelar", genero: "Ficção Científica", descricao: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço...", imagem: "https://upload.wikimedia.org/wikipedia/pt/3/3a/Interstellar_Filme.png", gostei: 0, naoGostei: 0 },
    { id: 2, titulo: "A Origem", genero: "Ação", descricao: "Um ladrão que rouba segredos corporativos através do uso da tecnologia de compartilhamento de sonhos.", imagem: "https://upload.wikimedia.org/wikipedia/pt/1/15/Inception_poster.jpg", gostei: 0, naoGostei: 0 },
    { id: 3, titulo: "Cidade de Deus", genero: "Drama", descricao: "A vida de vários personagens que crescem em uma violenta favela do Rio de Janeiro.", imagem: "https://upload.wikimedia.org/wikipedia/pt/1/10/CidadedeDeus.jpg", gostei: 0, naoGostei: 0 },
    { id: 4, titulo: "Parasita", genero: "Suspense", descricao: "Toda a família de Ki-taek está desempregada, vivendo num porão sujo e apertado.", imagem: "https://upload.wikimedia.org/wikipedia/pt/8/86/Parasite_poster.jpg", gostei: 0, naoGostei: 0 },
    { id: 5, titulo: "O Poderoso Chefão", genero: "Drama", descricao: "A saga de uma família mafiosa italiana em Nova York, focada na transformação de Michael Corleone.", imagem: "https://upload.wikimedia.org/wikipedia/pt/a/af/The_Godfather%2C_The_Don_is_Dead.jpg", gostei: 0, naoGostei: 0 }
];

// Função para buscar os dados. Tenta pegar do localStorage, se não existir, usa a lista inicial.
function getDados() {
    const dadosString = localStorage.getItem('dados_votacao');
    if (!dadosString) {
        salvarDados({ filmes: filmesIniciais });
        return { filmes: filmesIniciais };
    }
    return JSON.parse(dadosString);
}

// Função para salvar os dados no localStorage.
function salvarDados(dados) {
    localStorage.setItem('dados_votacao', JSON.stringify(dados));
}

// --- Fim da Lógica do "Banco de Dados" Local ---


// --- Início da Lógica da Aplicação ---

// Função principal que carrega e exibe os filmes na tela
function carregarFilmes() {
    const data = getDados();
    const filmes = data.filmes;

    const listaFilmesDiv = document.getElementById('lista-filmes');
    listaFilmesDiv.innerHTML = ''; 

    let totalGeralGostei = 0;
    let totalGeralNaoGostei = 0;

    filmes.forEach(filme => {
        totalGeralGostei += filme.gostei;
        totalGeralNaoGostei += filme.naoGostei;

        const filmeDiv = document.createElement('div');
        filmeDiv.className = 'card-filme';
        filmeDiv.innerHTML = `
            <img src="${filme.imagem}" alt="Pôster de ${filme.titulo}">
            <div class="info">
                <h3>${filme.titulo}</h3>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p>${filme.descricao}</p>
                <div class="votacao">
                    <button onclick="votar(${filme.id}, 'gostei')">👍 Gostei</button>
                    <span>${filme.gostei}</span>
                    <button onclick="votar(${filme.id}, 'naoGostei')">👎 Não Gostei</button>
                    <span>${filme.naoGostei}</span>
                </div>
            </div>
        `;
        listaFilmesDiv.appendChild(filmeDiv);
    });

    const totaisGeraisDiv = document.getElementById('totais-gerais');
    totaisGeraisDiv.innerHTML = `<span><b>Total Gostei:</b> ${totalGeralGostei}</span> | <span><b>Total Não Gostei:</b> ${totalGeralNaoGostei}</span>`;
}

// Função para registrar um voto
function votar(filmeId, tipoVoto) {
    const dados = getDados();
    const filme = dados.filmes.find(f => f.id === filmeId);

    if (filme) {
        filme[tipoVoto]++;
        salvarDados(dados);
        carregarFilmes();
    }
}

// Adiciona o evento ao formulário para cadastrar um novo filme
document.getElementById('form-cadastro').addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const dados = getDados();
    
    const novoFilme = {
        id: Date.now(), // Usa o tempo atual em milissegundos como ID único
        titulo: document.getElementById('titulo').value,
        genero: document.getElementById('genero').value,
        imagem: document.getElementById('imagem').value,
        descricao: document.getElementById('descricao').value,
        gostei: 0,
        naoGostei: 0
    };

    dados.filmes.push(novoFilme);
    salvarDados(dados);

    document.getElementById('form-cadastro').reset(); 
    carregarFilmes(); 
});

// Carrega os filmes assim que a página é aberta
carregarFilmes();