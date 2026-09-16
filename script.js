```javascript
"use strict";

/*
=========================================================
DISCORD LITE
JavaScript principal da interface
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const channelButtons = document.querySelectorAll(".channel");
    const currentChannel = document.getElementById("currentChannel");
    const messageInput = document.getElementById("messageInput");
    const messageForm = document.getElementById("messageForm");
    const messageArea = document.getElementById("messageArea");

    const channelContextMenu =
        document.getElementById("channelContextMenu");

    const serverMenu =
        document.getElementById("serverMenu");

    const serverMenuButton =
        document.getElementById("serverMenuButton");


    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function closeMenus() {
        channelContextMenu?.classList.remove("show");
        serverMenu?.classList.remove("show");
    }


    function escapeHTML(text) {
        const element = document.createElement("div");

        element.textContent = text;

        return element.innerHTML;
    }


    function scrollMessagesToBottom() {

        if (!messageArea) return;

        messageArea.scrollTop = messageArea.scrollHeight;
    }


    function updatePlaceholder(channelName) {

        if (!messageInput) return;

        messageInput.placeholder =
            `Enviar mensagem em #${channelName}`;
    }


    /* =====================================================
       SELEÇÃO DE CANAL
    ===================================================== */

    channelButtons.forEach(channel => {

        channel.addEventListener("click", event => {

            /*
             * Se clicou no botão de configurações
             * não troca de canal.
             */

            if (
                event.target.closest(".channel-options")
            ) {
                return;
            }


            channelButtons.forEach(item => {
                item.classList.remove("active");
            });


            channel.classList.add("active");


            const name =
                channel.dataset.channel ||
                channel.querySelector(".channel-name")?.textContent.trim() ||
                "geral";


            if (currentChannel) {
                currentChannel.textContent = name;
            }


            updatePlaceholder(name);


            closeMenus();

        });

    });


    /* =====================================================
       ENVIO DE MENSAGEM
    ===================================================== */

    if (messageForm) {

        messageForm.addEventListener("submit", event => {

            event.preventDefault();


            const text =
                messageInput?.value.trim();


            if (!text) return;


            const message =
                document.createElement("article");

            message.className = "message";


            const avatar =
                document.createElement("div");

            avatar.className =
                "message-avatar user-message-avatar";

            avatar.textContent = "U";


            const body =
                document.createElement("div");

            body.className =
                "message-body";


            const meta =
                document.createElement("div");

            meta.className =
                "message-meta";


            const author =
                document.createElement("strong");

            author.textContent =
                "Usuário";


            const time =
                document.createElement("time");

            time.textContent =
                "agora";


            meta.appendChild(author);
            meta.appendChild(time);


            const paragraph =
                document.createElement("p");

            /*
             * textContent impede HTML
             * enviado pelo usuário de virar código.
             */

            paragraph.textContent =
                text;


            body.appendChild(meta);
            body.appendChild(paragraph);


            message.appendChild(avatar);
            message.appendChild(body);


            messageArea.appendChild(message);


            messageInput.value = "";


            scrollMessagesToBottom();

        });

    }


    /* =====================================================
       ENTER / SHIFT + ENTER
    ===================================================== */

    if (messageInput) {

        messageInput.addEventListener("keydown", event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                messageForm?.requestSubmit();

            }

        });

    }


    /* =====================================================
       MENU DO SERVIDOR
    ===================================================== */

    if (serverMenuButton && serverMenu) {

        serverMenuButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const isOpen =
                    serverMenu.classList.contains("show");


                closeMenus();


                if (!isOpen) {

                    const rect =
                        serverMenuButton.getBoundingClientRect();


                    serverMenu.style.left =
                        `${rect.left + rect.width + 6}px`;

                    serverMenu.style.top =
                        `${rect.bottom + 5}px`;


                    serverMenu.classList.add("show");

                }

            }
        );

    }


    /* =====================================================
       MENU DE CONTEXTO DO CANAL
    ===================================================== */

    channelButtons.forEach(channel => {

        channel.addEventListener(
            "contextmenu",
            event => {

                event.preventDefault();

                closeMenus();


                if (!channelContextMenu) return;


                const menuWidth =
                    220;

                const menuHeight =
                    250;


                let left =
                    event.clientX;

                let top =
                    event.clientY;


                /*
                 * Evita que o menu saia da tela.
                 */

                if (
                    left + menuWidth >
                    window.innerWidth
                ) {

                    left =
                        window.innerWidth -
                        menuWidth -
                        10;

                }


                if (
                    top + menuHeight >
                    window.innerHeight
                ) {

                    top =
                        window.innerHeight -
                        menuHeight -
                        10;

                }


                channelContextMenu.style.left =
                    `${Math.max(5, left)}px`;

                channelContextMenu.style.top =
                    `${Math.max(5, top)}px`;


                channelContextMenu.classList.add("show");

            }
        );

    });


    /* =====================================================
       FECHAR MENUS
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(".context-menu") &&
                !event.target.closest(".server-menu") &&
                !event.target.closest("#serverMenuButton")
            ) {

                closeMenus();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMenus();
            }

        }
    );


    /* =====================================================
       CATEGORIAS
    ===================================================== */

    document
        .querySelectorAll(".channel-category")
        .forEach(category => {

            const collapseButton =
                category.querySelector(
                    ".category-collapse"
                );

            const channels =
                category.querySelector(
                    ".channels"
                );


            if (!collapseButton || !channels) {
                return;
            }


            collapseButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const collapsed =
                        channels.style.display === "none";


                    if (collapsed) {

                        channels.style.display =
                            "";

                        collapseButton
                            .querySelector("span")
                            .textContent = "⌄";

                    } else {

                        channels.style.display =
                            "none";

                        collapseButton
                            .querySelector("span")
                            .textContent = "›";

                    }

                }
            );

        });


    /* =====================================================
       BOTÕES DE CRIAR CANAL
    ===================================================== */

    document
        .querySelectorAll(".category-add")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const category =
                        button.closest(
                            ".channel-category"
                        );

                    const categoryName =
                        category
                            ?.querySelector(
                                ".category-name"
                            )
                            ?.textContent
                            .trim()
                            .toLowerCase();


                    const name =
                        window.prompt(
                            `Nome do novo canal de ${categoryName || "texto"}:`
                        );


                    if (!name) return;


                    const channels =
                        category.querySelector(
                            ".channels"
                        );


                    if (!channels) return;


                    const newChannel =
                        document.createElement("button");

                    newChannel.className =
                        "channel";

                    newChannel.dataset.channel =
                        name
                            .toLowerCase()
                            .replace(/\s+/g, "-");


                    newChannel.innerHTML = `
                        <span class="channel-icon">#</span>
                        <span class="channel-name"></span>
                        <span class="channel-options">⚙</span>
                    `;


                    newChannel
                        .querySelector(".channel-name")
                        .textContent = name;


                    channels.appendChild(newChannel);


                    /*
                     * Adiciona os mesmos eventos
                     * dos canais existentes.
                     */

                    setupChannel(newChannel);

                }
            );

        });


    /* =====================================================
       CONFIGURAÇÃO DE CANAL
    ===================================================== */

    function setupChannel(channel) {

        channel.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".channel-options"
                    )
                ) {

                    event.stopPropagation();

                    openChannelSettings(channel);

                    return;

                }


                channelButtons.forEach(item => {
                    item.classList.remove("active");
                });


                document
                    .querySelectorAll(".channel")
                    .forEach(item => {
                        item.classList.remove("active");
                    });


                channel.classList.add("active");


                const name =
                    channel.dataset.channel ||
                    channel
                        .querySelector(".channel-name")
                        ?.textContent
                        .trim() ||
                    "geral";


                if (currentChannel) {
                    currentChannel.textContent =
                        name;
                }


                updatePlaceholder(name);

            }
        );


        channel.addEventListener(
            "contextmenu",
            event => {

                event.preventDefault();

                closeMenus();

                if (!channelContextMenu) {
                    return;
                }


                let left =
                    event.clientX;

                let top =
                    event.clientY;


                const width =
                    220;

                const height =
                    250;


                if (
                    left + width >
                    window.innerWidth
                ) {

                    left =
                        window.innerWidth -
                        width -
                        10;

                }


                if (
                    top + height >
                    window.innerHeight
                ) {

                    top =
                        window.innerHeight -
                        height -
                        10;

                }


                channelContextMenu.style.left =
                    `${Math.max(5, left)}px`;

                channelContextMenu.style.top =
                    `${Math.max(5, top)}px`;


                channelContextMenu.classList.add(
                    "show"
                );

            }
        );

    }


    function openChannelSettings(channel) {

        const name =
            channel
                .querySelector(".channel-name")
                ?.textContent
                .trim() ||
            "canal";


        const action =
            window.prompt(
                `Configurações de #${name}\n\n` +
                `Digite uma opção:\n` +
                `1 - Editar nome\n` +
                `2 - Excluir canal\n` +
                `3 - Cancelar`
            );


        if (action === "1") {

            const newName =
                window.prompt(
                    "Novo nome do canal:",
                    name
                );


            if (
                newName &&
                newName.trim()
            ) {

                channel
                    .querySelector(
                        ".channel-name"
                    )
                    .textContent =
                    newName.trim();


                channel.dataset.channel =
                    newName
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "-");


                if (
                    channel.classList.contains(
                        "active"
                    )
                ) {

                    currentChannel.textContent =
                        newName.trim();

                    updatePlaceholder(
                        newName.trim()
                    );

                }

            }

        }


        if (action === "2") {

            const confirmed =
                window.confirm(
                    `Excluir o canal #${name}?`
                );


            if (confirmed) {

                const wasActive =
                    channel.classList.contains(
                        "active"
                    );


                channel.remove();


                if (wasActive) {

                    const firstChannel =
                        document.querySelector(
                            ".channel"
                        );


                    if (firstChannel) {

                        firstChannel.click();

                    }

                }

            }

        }

    }


    /*
     * Inicializa os canais existentes.
     */

    document
        .querySelectorAll(".channel")
        .forEach(channel => {

            /*
             * O primeiro listener já foi criado acima
             * para os canais existentes.
             *
             * Aqui só adicionamos o botão de configurações.
             */

            const options =
                channel.querySelector(
                    ".channel-options"
                );


            if (options) {

                options.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openChannelSettings(
                            channel
                        );

                    }
                );

            }

        });


    /* =====================================================
       BOTÃO DE PESQUISA
    ===================================================== */

    const serverSearchButton =
        document.getElementById(
            "serverSearchButton"
        );


    if (serverSearchButton) {

        serverSearchButton.addEventListener(
            "click",
            () => {

                const search =
                    window.prompt(
                        "O que você deseja pesquisar?"
                    );


                if (!search) return;


                const query =
                    search.trim().toLowerCase();


                document
                    .querySelectorAll(".channel")
                    .forEach(channel => {

                        const name =
                            channel
                                .querySelector(
                                    ".channel-name"
                                )
                                ?.textContent
                                .toLowerCase() ||
                            "";


                        channel.style.display =
                            name.includes(query)
                                ? ""
                                : "none";

                    });

            }
        );

    }


    /* =====================================================
       PESQUISA DE MENSAGENS
    ===================================================== */

    const messageSearch =
        document.getElementById(
            "messageSearch"
        );


    if (messageSearch) {

        messageSearch.addEventListener(
            "input",
            () => {

                const query =
                    messageSearch.value
                        .trim()
                        .toLowerCase();


                document
                    .querySelectorAll(
                        ".message"
                    )
                    .forEach(message => {

                        const content =
                            message.textContent
                                .toLowerCase();


                        message.style.display =
                            !query ||
                            content.includes(query)
                                ? ""
                                : "none";

                    });

            }
        );

    }


    /* =====================================================
       BOTÕES DE MEMBROS
    ===================================================== */

    document
        .querySelectorAll(".member")
        .forEach(member => {

            member.addEventListener(
                "click",
                () => {

                    const name =
                        member
                            .querySelector(
                                ".member-name"
                            )
                            ?.textContent
                            .trim();


                    if (!name) return;


                    console.log(
                        `Perfil de ${name}`
                    );

                }
            );

        });


    /* =====================================================
       BOTÕES DE MICROFONE / SOM
    ===================================================== */

    document
        .querySelectorAll(".user-actions button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    button.classList.toggle(
                        "disabled"
                    );

                }
            );

        });


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    updatePlaceholder(
        currentChannel?.textContent.trim() ||
        "geral"
    );


    scrollMessagesToBottom();

});
```
