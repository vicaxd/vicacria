/* ==========================================================================
   vicacria · funcionamento do site
   1. WhatsApp: número e mensagens (é só mudar aqui)
   2. Botões do WhatsApp
   3. Quiz
   4. Botão flutuante
   5. Celulares com botões (Trabalhos e Sistemas)
   ========================================================================== */

(function () {
    "use strict";


    /* 1. WhatsApp: número e mensagens
       ------------------------------------------------------------------------
       Cada botão do site escolhe uma mensagem pelo nome, no atributo data-wa.
       Exemplo: <a data-wa="portfolio">  usa a mensagem "portfolio" abaixo.  */

    var WHATSAPP = "5551992814761";

    var MENSAGENS = {
        geral:     "Oi, Vica! Vim pelo teu site e quero conversar sobre um projeto.",
        portfolio: "Oi, Vica! Quero um orçamento do Portfólio Inteligente.",
        sistema:   "Oi, Vica! Quero um orçamento de um Sistema sob medida.",
        agenda:    "Oi, Vica! Vi o sistema de agendamento no teu site e quero um orçamento de um sistema pro meu negócio."
    };

    function linkWhatsApp(texto) {
        return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
    }


    /* 2. Botões do WhatsApp
       ------------------------------------------------------------------------ */

    document.querySelectorAll("[data-wa]").forEach(function (botao) {
        var texto = MENSAGENS[botao.dataset.wa] || MENSAGENS.geral;
        botao.href = linkWhatsApp(texto);
    });


    /* 3. Quiz
       ------------------------------------------------------------------------
       Cada pergunta tem um "rotulo" (aparece na mensagem do WhatsApp).
       Cada resposta pode ter "indica": a oferta que ela sugere.
       Dá pra mudar o texto, a ordem ou incluir perguntas sem mexer no resto. */

    var OFERTAS = {
        agendamento: "Sistema sob medida · site com agendamento online",
        sistema:     "Sistema sob medida · site com um sistema pro seu negócio",
        pdf:         "Portfólio Inteligente · a partir do seu PDF",
        montagem:    "Portfólio Inteligente · eu monto tudo pra você"
    };

    /* se mais de uma resposta indicar algo, vale a que vem primeiro nesta lista */
    var PRIORIDADE = ["agendamento", "sistema", "pdf", "montagem"];

    var PERGUNTAS = [
        {
            pergunta: "O que você precisa?",
            rotulo: "Preciso de",
            respostas: [
                { texto: "Um site pra mostrar meu trabalho", detalhe: "portfólio, cardápio, catálogo ou o que você quiser" },
                { texto: "Site com agendamento online", indica: "agendamento" },
                { texto: "Um sistema pro meu negócio", detalhe: "algo diferente, que a gente estuda junto", indica: "sistema" },
                { texto: "Ainda não sei" }
            ]
        },
        {
            pergunta: "Qual é a sua área?",
            rotulo: "Área",
            respostas: [
                { texto: "Saúde e bem-estar", detalhe: "médico, dentista, psicólogo, terapeuta…" },
                { texto: "Direito e consultoria" },
                { texto: "Beleza e estética" },
                { texto: "Alimentação e comércio" },
                { texto: "Outra área" }
            ]
        },
        {
            pergunta: "O que tem hoje no seu link da bio?",
            rotulo: "Link da bio hoje",
            respostas: [
                { texto: "Só o link do WhatsApp" },
                { texto: "Um PDF ou página do Canva" },
                { texto: "Um link genérico com vários botões" },
                { texto: "Ainda não tenho link" }
            ]
        },
        {
            pergunta: "Você já tem textos e fotos prontos?",
            rotulo: "Material",
            respostas: [
                { texto: "Sim, tenho um PDF pronto", detalhe: "vou te enviar do jeito que quero", indica: "pdf" },
                { texto: "Tenho fotos e ideias soltas", detalhe: "preciso que você monte", indica: "montagem" },
                { texto: "Ainda não tenho nada", detalhe: "preciso de ajuda do começo", indica: "montagem" }
            ]
        },
        {
            pergunta: "Você já tem um domínio?",
            rotulo: "Domínio",
            respostas: [
                { texto: "Sim, já tenho", detalhe: "tipo www.seunome.com.br" },
                { texto: "Ainda não, preciso registrar um" },
                { texto: "Quero entender melhor" }
            ]
        }
    ];

    var LETRAS = "ABCDEFGH";
    var caixa = document.getElementById("qb");
    var barra = document.getElementById("bar");
    var escolhas = [];   /* posição da resposta escolhida em cada pergunta */
    var atual = 0;       /* pergunta que está na tela */

    /* evita que um texto com < ou > quebre a página */
    function seguro(texto) {
        return String(texto).replace(/[&<>"]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
        });
    }

    function respostasEscolhidas() {
        return PERGUNTAS.map(function (p, n) {
            return p.respostas[escolhas[n]];
        });
    }

    function recomendacao() {
        var indicadas = respostasEscolhidas().map(function (r) { return r.indica; });
        var oferta = PRIORIDADE.find(function (o) { return indicadas.indexOf(o) >= 0; });
        return OFERTAS[oferta || "montagem"];
    }

    function mostrarPergunta() {
        if (atual >= PERGUNTAS.length) {
            mostrarResultado();
            return;
        }

        barra.style.width = (atual / PERGUNTAS.length) * 100 + "%";

        var p = PERGUNTAS[atual];
        var html =
            '<div class="fade">' +
                '<span class="qn">Pergunta ' + (atual + 1) + " de " + PERGUNTAS.length + "</span>" +
                "<h3>" + seguro(p.pergunta) + "</h3>" +
                '<div class="op">';

        p.respostas.forEach(function (r, n) {
            html +=
                '<button class="o' + (escolhas[atual] === n ? " on" : "") + '" data-n="' + n + '">' +
                    "<b>" + LETRAS[n] + "</b>" +
                    "<span>" + seguro(r.texto) + (r.detalhe ? "<small>" + seguro(r.detalhe) + "</small>" : "") + "</span>" +
                "</button>";
        });

        html += "</div>";
        if (atual > 0) html += '<button class="back">← Voltar</button>';
        html += "</div>";

        caixa.innerHTML = html;
    }

    function mostrarResultado() {
        barra.style.width = "100%";

        var oferta = recomendacao();
        var linhas = respostasEscolhidas().map(function (r, n) {
            return PERGUNTAS[n].rotulo + ": " + r.texto;
        });
        var mensagem =
            "Oi, Vica! Respondi o quiz no teu site.\n\n" +
            linhas.join("\n") +
            "\n\nCombinou: " + oferta + ". Quero um orçamento!";

        caixa.innerHTML =
            '<div class="fade res">' +
                '<span class="qn">Resultado</span>' +
                "<h3>Essa é a sua cara</h3>" +
                '<div class="rec">' +
                    "<small>Recomendação</small>" +
                    "<strong>" + seguro(oferta) + "</strong>" +
                    "<p>Valores e prazo eu te passo no WhatsApp, de acordo com o que você precisa.</p>" +
                "</div>" +
                '<a class="b bw" href="' + linkWhatsApp(mensagem) + '" target="_blank" rel="noopener">' +
                    '<svg aria-hidden="true"><use href="#wa"/></svg>Mandar no WhatsApp' +
                "</a>" +
                '<button class="back redo">↺ Refazer</button>' +
            "</div>";
    }

    caixa.addEventListener("click", function (evento) {
        var opcao = evento.target.closest(".o");

        if (opcao) {
            escolhas[atual] = Number(opcao.dataset.n);
            opcao.classList.add("on");
            setTimeout(function () {
                atual++;
                mostrarPergunta();
            }, 160);
            return;
        }

        if (evento.target.closest(".redo")) {
            escolhas = [];
            atual = 0;
            mostrarPergunta();
        } else if (evento.target.closest(".back")) {
            atual--;
            mostrarPergunta();
        }
    });

    mostrarPergunta();


    /* 4. Botão flutuante
       ------------------------------------------------------------------------
       Fica escondido enquanto a abertura do site está na tela,
       pra não ficar em cima do quadro de destaques. */

    var flutuante = document.querySelector(".fab");
    var abertura = document.querySelector(".hero");

    if ("IntersectionObserver" in window) {
        flutuante.classList.add("off");
        new IntersectionObserver(function (itens) {
            flutuante.classList.toggle("off", itens[0].isIntersecting);
        }).observe(abertura);
    }


    /* 5. Celulares com botões (Trabalhos e Sistemas)
       ------------------------------------------------------------------------
       Cada bloco marcado com data-vitrine tem um celular com vídeo e botões.
       Tocar num botão troca o vídeo do celular e o texto de baixo.
       O vídeo só carrega e toca quando o celular aparece na tela.
       Quem pediu "menos movimento" no celular vê só a imagem parada. */

    var semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll("[data-vitrine]").forEach(function (bloco) {
        var video = bloco.querySelector("video");
        var abas = Array.prototype.slice.call(bloco.querySelectorAll("[role=tab]"));
        var naTela = false;

        function tocar() {
            if (naTela && !semMovimento) video.play().catch(function () {});
        }

        function escolher(aba) {
            abas.forEach(function (outra) {
                var escolhida = outra === aba;
                outra.setAttribute("aria-selected", escolhida);
                outra.tabIndex = escolhida ? 0 : -1;
                document.getElementById(outra.getAttribute("aria-controls")).hidden = !escolhida;
            });

            var nome = aba.dataset.video;
            video.classList.add("trocando");
            setTimeout(function () {
                video.poster = "video/" + nome + ".webp";
                video.src = "video/" + nome + ".mp4";
                video.setAttribute("aria-label", "Vídeo " + aba.dataset.nome);
                video.classList.remove("trocando");
                tocar();
            }, 200);
        }

        abas.forEach(function (aba, n) {
            aba.addEventListener("click", function () {
                if (aba.getAttribute("aria-selected") !== "true") escolher(aba);
            });

            /* setas do teclado passam de um botão pro outro */
            aba.addEventListener("keydown", function (evento) {
                var passo = evento.key === "ArrowRight" ? 1 : evento.key === "ArrowLeft" ? -1 : 0;
                if (!passo) return;
                var proxima = abas[(n + passo + abas.length) % abas.length];
                proxima.focus();
                escolher(proxima);
            });
        });

        if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (itens) {
                naTela = itens[0].isIntersecting;
                if (naTela) tocar();
                else video.pause();
            }, { threshold: 0.3 }).observe(video);
        }
    });
})();
