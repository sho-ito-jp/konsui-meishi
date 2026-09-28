const CARD_WIDTH = 1075;
const CARD_HEIGHT = 650;


/* =========================
   デフォルト設定
========================= */

const DEFAULT_SETTINGS = {

    name: {
        x: 537,
        y: 280,
        size: 64
    },

    role: {
        x: 537,
        y: 350,
        size: 30
    }

};


let settings = {

    name: {
        ...DEFAULT_SETTINGS.name
    },

    role: {
        ...DEFAULT_SETTINGS.role
    }

};


/* =========================
   DOM
========================= */

const nameInput =
    document.getElementById("nameInput");

const roleInput =
    document.getElementById("roleInput");

const nameText =
    document.getElementById("nameText");

const roleText =
    document.getElementById("roleText");

const nameSize =
    document.getElementById("nameSize");

const roleSize =
    document.getElementById("roleSize");

const nameSizeValue =
    document.getElementById("nameSizeValue");

const roleSizeValue =
    document.getElementById("roleSizeValue");

const card =
    document.getElementById("card");


/* =========================
   入力
========================= */

nameInput.addEventListener(
    "input",
    () => {
        nameText.textContent =
            nameInput.value || "名前";
    }
);

roleInput.addEventListener(
    "input",
    () => {
        roleText.textContent =
            roleInput.value || "役職";
    }
);


/* =========================
   表示更新
========================= */

function updateName() {

    nameText.style.left =
        settings.name.x + "px";

    nameText.style.top =
        settings.name.y + "px";

    nameText.style.fontSize =
        settings.name.size + "px";

    nameSize.value =
        settings.name.size;

    nameSizeValue.textContent =
        settings.name.size + "px";
}


function updateRole() {

    roleText.style.left =
        settings.role.x + "px";

    roleText.style.top =
        settings.role.y + "px";

    roleText.style.fontSize =
        settings.role.size + "px";

    roleSize.value =
        settings.role.size;

    roleSizeValue.textContent =
        settings.role.size + "px";
}


updateName();
updateRole();


/* =========================
   サイズ変更
========================= */

nameSize.addEventListener(
    "input",
    () => {

        settings.name.size =
            Number(nameSize.value);

        updateName();

    }
);


roleSize.addEventListener(
    "input",
    () => {

        settings.role.size =
            Number(roleSize.value);

        updateRole();

    }
);


/* =========================
   ドラッグ
========================= */

function makeDraggable(element, type) {

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    element.addEventListener(
        "mousedown",
        (event) => {

            dragging = true;

            const rect =
                card.getBoundingClientRect();

            const mouseX =
                event.clientX - rect.left;

            const mouseY =
                event.clientY - rect.top;

            offsetX =
                mouseX - settings[type].x;

            offsetY =
                mouseY - settings[type].y;

            event.preventDefault();
        }
    );


    document.addEventListener(
        "mousemove",
        (event) => {

            if (!dragging) return;

            const rect =
                card.getBoundingClientRect();

            const mouseX =
                event.clientX - rect.left;

            const mouseY =
                event.clientY - rect.top;

            settings[type].x =
                mouseX - offsetX;

            settings[type].y =
                mouseY - offsetY;


            settings[type].x =
                Math.max(
                    0,
                    Math.min(
                        CARD_WIDTH,
                        settings[type].x
                    )
                );

            settings[type].y =
                Math.max(
                    0,
                    Math.min(
                        CARD_HEIGHT,
                        settings[type].y
                    )
                );


            if (type === "name") {
                updateName();
            } else {
                updateRole();
            }

        }
    );


    document.addEventListener(
        "mouseup",
        () => {
            dragging = false;
        }
    );

}


makeDraggable(
    nameText,
    "name"
);

makeDraggable(
    roleText,
    "role"
);


/* =========================
   PNG書き出し
========================= */

document
    .getElementById("downloadButton")
    .addEventListener(
        "click",
        async () => {

            /*
             * Webフォントが読み込まれるのを待つ
             */

            await document.fonts.ready;

            await document.fonts.load(
                `"${settings.name.size}px Hannari"`
            );


            const canvas =
                document.createElement("canvas");

            canvas.width =
                CARD_WIDTH;

            canvas.height =
                CARD_HEIGHT;

            const ctx =
                canvas.getContext("2d");


            const background =
                new Image();

            background.src =
                "meishi.png";


            background.onload =
                () => {

                    /* 背景 */

                    ctx.drawImage(
                        background,
                        0,
                        0,
                        CARD_WIDTH,
                        CARD_HEIGHT
                    );


                    /* 名前 */

                    ctx.save();

                    ctx.fillStyle =
                        "#000000";

                    ctx.font =
                        `${settings.name.size}px Hannari`;

                    ctx.textAlign =
                        "center";

                    ctx.textBaseline =
                        "middle";

                    ctx.fillText(
                        nameInput.value || "名前",
                        settings.name.x,
                        settings.name.y
                    );

                    ctx.restore();


                    /* 役職 */

                    ctx.save();

                    ctx.fillStyle =
                        "#000000";

                    ctx.font =
                        `${settings.role.size}px Hannari`;

                    ctx.textAlign =
                        "center";

                    ctx.textBaseline =
                        "middle";

                    ctx.fillText(
                        roleInput.value || "役職",
                        settings.role.x,
                        settings.role.y
                    );

                    ctx.restore();


                    /* ダウンロード */

                    const link =
                        document.createElement("a");

                    const fileName =
                        nameInput.value.trim() ||
                        "名刺";

                    link.download =
                        `${fileName}_名刺.png`;

                    link.href =
                        canvas.toDataURL(
                            "image/png"
                        );

                    link.click();

                };

        }
    );
