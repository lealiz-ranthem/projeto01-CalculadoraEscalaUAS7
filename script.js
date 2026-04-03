const uas7 = {}
const selects = document.querySelectorAll("select")
const datas = document.querySelectorAll('input[type="date"]')
const botaoResultado = document.getElementById("resultado")

function uas7Completo () {
    for (let dia = 1; dia <= 7; dia ++) {
        if (!uas7[dia]) return false

        const { lesoes, prurido, total } = uas7[dia]

        if (
            lesoes === undefined ||
            prurido === undefined ||
            total === undefined
        ) {
            return false
        }
    }
    return true
}

function calcularUAS7Final() {
    let totalFinal = 0

    for (let dia = 1; dia <= 7; dia++) {
        totalFinal += uas7[dia].total
    }

    return totalFinal

}

function classificarUAS7(valor) {
    if (valor <= 6) {
        return "Urticária bem controlada."
    }
    if (valor <= 15) {
        return "Urticária leve."
    }
    if (valor <= 27) {
        return "Urticária moderada."
    }
    if (valor <= 42) {
        return "Urticária grave."
    }
}

function scoreDoDia(dia) {
    const { lesoes, prurido } = uas7[dia]

    const scoreContainer = document.querySelector(`#score-dia-${dia}`)?.parentElement

    if (lesoes !== undefined && prurido !== undefined) {
        const total = lesoes + prurido
        uas7[dia].total = total
        
        const scoreOutput = document.getElementById(`score-dia-${dia}`)
        scoreOutput.textContent = total
        scoreContainer.classList.remove("hidden")

        liberaProximoDia(Number(dia))
        atualizarBotaoResultado()
    }
}

function liberaProximoDia (diaAtual) {
    const proximoDia = diaAtual + 1
    const fieldsetProximoDia = document.getElementById(`fieldset-dia-${proximoDia}`)
    
    if (fieldsetProximoDia) {
        fieldsetProximoDia.classList.remove("hidden")
    }
}

function atualizarBotaoResultado() {
    botaoResultado.disabled = !uas7Completo()
}

datas.forEach((inputData) => {
    inputData.addEventListener("change", () => {
        const partes = inputData.id.split("-")
        const diaAtual = Number(partes[2])
        
        if (diaAtual === 1) {
            return
        }
        
        const inputDiaAnterior = document.getElementById(`data-dia-${diaAtual - 1}`)
        const aviso = document.getElementById(`aviso-dia-${diaAtual}`)
        const valorDiaAnterior = inputDiaAnterior.value
        
        if (!inputDiaAnterior || inputDiaAnterior.value === "") {
            aviso.classList.remove("hidden")
            return
        }

        const dataAtual = new Date(inputData.value)
        const dataAnterior = new Date(valorDiaAnterior)
        
        
        const umDia = 24 * 60 * 60 * 1000
        const diferencaDias = (dataAtual - dataAnterior) / umDia
         
        if (diferencaDias !== 1) {
            aviso.classList.remove("hidden")
        } else {
            aviso.classList.add("hidden")
        }                  
       
    })

})

selects.forEach((select) => {
    select.addEventListener("change", () => { /* aqui, change é um evento reconhecido pelo navegador */
        const partes = select.id.split("-")
        const tipo = partes[0]
        const dia = partes[2]

        const valorSelecionado = select.value
        if (valorSelecionado === "") {
            return
        }

        const valor = Number(valorSelecionado)
      
        if (!uas7[dia]){
            uas7[dia] = {}
        }
        
        uas7[dia][tipo] = valor
        
        scoreDoDia(dia)
    })
})

botaoResultado.addEventListener("click", () => {
    const uas7final = calcularUAS7Final()
    const classificacao = classificarUAS7(uas7final)

    const containerFinal = document.getElementById("uas7-final")
    const valorFinal = document.getElementById("valor-uas7-final")
    const textoClassificacao = document.getElementById("classificacao-uas7")

    
    valorFinal.textContent = uas7final
    textoClassificacao.textContent = classificacao

    containerFinal.classList.remove("hidden")
})

function mostrarSecao(secaoId) {
    const todasSecoes = document.querySelectorAll('.secao-cards')

    todasSecoes.forEach(secao => {
        if (secao.id === secaoId) {
            secao.classList.toggle('visivel')
        } else {
            secao.classList.remove('visivel')
        }
    })
}



/*Futuro: salvar e listar histórico de avaliações UAS-7 */