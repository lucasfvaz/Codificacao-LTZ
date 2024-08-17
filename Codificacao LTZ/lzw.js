// Função para codificação usando o algoritmo LZW
function encodeLZW() {
    const input = document.getElementById('inputText').value; // Obtém o texto de entrada do usuário
    const dictionary = {}; // Inicializa o dicionário vazio
    const data = (input + "").split(""); // Divide o texto de entrada em caracteres
    const output = []; // Array para armazenar a saída codificada
    let currentChar;
    let phrase = data[0]; // Inicia a frase com o primeiro caractere
    let code = 256; // Código inicial para novos padrões

    // Itera sobre cada caractere da entrada
    for (let i = 1; i < data.length; i++) {
        currentChar = data[i];
        // Verifica se a combinação de frase + caractere atual já está no dicionário
        if (dictionary[phrase + currentChar] != null) {
            phrase += currentChar; // Se estiver, adiciona o caractere à frase
        } else {
            // Se não estiver, adiciona o código da frase ao output
            output.push(phrase.length > 1 ? dictionary[phrase] : phrase.charCodeAt(0));
            dictionary[phrase + currentChar] = code; // Adiciona a nova frase + caractere ao dicionário
            code++; // Incrementa o código para o próximo novo padrão
            phrase = currentChar; // Reinicia a frase com o caractere atual
        }
    }
    // Adiciona a última frase ao output
    output.push(phrase.length > 1 ? dictionary[phrase] : phrase.charCodeAt(0));

    // Exibe a saída codificada no HTML
    document.getElementById('encodedOutput').textContent = output.join(", ");

    // Calcula a taxa de compressão
    const originalSize = input.length * 7; // Tamanho original em bits
    const compressedSize = output.length * 12; // Tamanho comprimido em bits (assumindo 12 bits por código)
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2); // Taxa de compressão

    // Exibe a taxa de compressão no HTML
    document.getElementById('compressionRatio').textContent = `Taxa de Compressão: ${compressionRatio}%`;
}

// Função para ajustar a formatação do dicionário
function formatDictionary(input) {
    const formattedEntries = input.split(",").map(entry => {
        let [index, char] = entry.split(":");
        index = index.trim();
        char = char.trim();
        return `${index}: ${char}`;
    });
    return formattedEntries.join(", ");
}

// Função para decodificação usando o algoritmo LZW
function decodeLZW() {
    // Ajusta a formatação do dicionário
    const rawDictionaryInput = document.getElementById('dictionaryText').value;
    const formattedDictionaryInput = formatDictionary(rawDictionaryInput);
    document.getElementById('dictionaryText').value = formattedDictionaryInput;

    const encodedInput = document.getElementById('encodedText').value.split(",").map(Number); // Obtém os códigos codificados do usuário e os converte para números
    const dictionaryInput = formattedDictionaryInput.split(", "); // Obtém o dicionário inicial do usuário
    
    const dictionary = {};
    // Popula o dicionário inicial a partir da entrada do usuário
    for (const entry of dictionaryInput) {
        const [index, char] = entry.split(": ");
        dictionary[Number(index)] = char;
    }

    let currentCode = encodedInput[0]; // Obtém o primeiro código da entrada codificada
    let currentChar = dictionary[currentCode]; // Obtém o primeiro caractere decodificado do dicionário
    let oldPhrase = currentChar; // Inicia a frase antiga com o primeiro caractere
    const output = [currentChar]; // Array para armazenar a saída decodificada
    let code = Math.max(...Object.keys(dictionary).map(Number)) + 1; // Define o próximo código disponível baseado no maior índice do dicionário
    let phrase;

    // Itera sobre cada código da entrada codificada
    for (let i = 1; i < encodedInput.length; i++) {
        currentCode = encodedInput[i];
        // Verifica se o código atual está no dicionário
        if (dictionary[currentCode] != null) {
            phrase = dictionary[currentCode];
        } else {
            // Se não estiver, usa a frase antiga mais o primeiro caractere da frase antiga
            phrase = oldPhrase + currentChar;
        }
        output.push(phrase); // Adiciona a frase decodificada à saída
        currentChar = phrase.charAt(0); // Define o caractere atual como o primeiro da frase
        dictionary[code] = oldPhrase + currentChar; // Adiciona a nova entrada ao dicionário
        code++; // Incrementa o código para o próximo novo padrão
        oldPhrase = phrase; // Atualiza a frase antiga para a próxima iteração
    }

    // Exibe a saída decodificada no HTML
    document.getElementById('decodedOutput').textContent = output.join("");
}
