const listProd = document.querySelector(".listar-Produtos");
const cadForm = document.getElementById("cad-produto-form");
const editForm = document.getElementById("edit-usuario-form");
const msgAlertaErroCad = document.getElementById("msgAlertaErroCad");
const msgAlertaErroEdit = document.getElementById("msgAlertaErroEdit");
const msgAlerta = document.getElementById("msgAlerta");
const cadModal = new bootstrap.Modal(document.getElementById("criarProdutoModal"));

const listarProdutos = async (pagina) => {
    const dados = await fetch("./exibir-produto.php?pagina=" + pagina);
    const resposta = await dados.text();
    listProd.innerHTML = resposta;
}

listarProdutos(1);

cadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("cad-produto-btn").value = "Salvou";
    
    if (document.getElementById("nome_produt").value === "") {
        msgAlertaErroCad.innerHTML = "<div class='alert alert-danger' role='alert'>Erro: Necessário preencher o campo Nome Produto!</div>";
        setTimeout(() => {
            msgAlertaErroCad.innerHTML = "";
        }, 5000)
    } else if (document.getElementById("qtde_produt").value === "") {
        msgAlertaErroCad.innerHTML = "<div class='alert alert-danger' role='alert'>Erro: Necessário preencher o campo Quantidade!</div>";
        setTimeout(() => {
            msgAlertaErroCad.innerHTML = "";
        }, 5000)
    } else if (document.getElementById("valor_produt").value === "") {
        msgAlertaErroCad.innerHTML = "<div class='alert alert-danger' role='alert'>Erro: Necessário preencher o campo Valor Unitario!</div>";
        setTimeout(() => {
            msgAlertaErroCad.innerHTML = "";
        }, 5000)
    } else if (document.getElementById("desc_produt").value === "") {
        msgAlertaErroCad.innerHTML = "<div class='alert alert-danger' role='alert'>Erro: Necessário preencher o campo Descrição!</div>";
        setTimeout(() => {
            msgAlertaErroCad.innerHTML = "";
        }, 5000)
    } else {
        const dadosForm = new FormData(cadForm);
        dadosForm.append("add", 1);

        const dados = await fetch("criar-produto.php", {
            method: "POST",
            body: dadosForm,
        });

        const resposta = await dados.json();

        if (resposta['erro']) {
            msgAlertaErroCad.innerHTML = resposta['msg'];
            setTimeout(() => {
                msgAlertaErroCad.innerHTML = "";
            }, 5000)
        } else {
            msgAlerta.innerHTML = resposta['msg'];
            setTimeout(() => {
                msgAlerta.innerHTML = "";
            }, 5000)
            
            cadForm.reset();
            cadModal.hide();
            listarProdutos(1);
        }
    }

    document.getElementById("cad-produto-btn").value = "Cadastrar";
});

async function visProduto(id_produt) {
    //console.log("Acessou: " + id_form);
    const dados = await fetch('ver-produto.php?id_produt=' + id_produt);
    const resposta = await dados.json();
    //console.log(resposta);

    if (resposta['erro']) {
        msgAlerta.innerHTML = resposta['msg'];
        setTimeout(() => {
            msgAlerta.innerHTML = "";
        }, 5000)
    } else {
        const visModal = new bootstrap.Modal(document.getElementById("visProdutoModal"));
        visModal.show();

        document.getElementById("idProduto").innerHTML = resposta['dados'].id_produt;
        document.getElementById("nomeProduto").innerHTML = resposta['dados'].nome_produt;
        document.getElementById("qtdeProduto").innerHTML = resposta['dados'].qtde_produt;

        document.getElementById("valorProduto").innerHTML = resposta['dados'].valor_produt;
        document.getElementById("descricaoProduto").innerHTML = resposta['dados'].desc_produt;
    }

}

async function editUsuarioDados(id_form) {
    msgAlertaErroEdit.innerHTML = "";

    const dados = await fetch('visualizar.php?id_form=' + id_form);
    const resposta = await dados.json();
    //console.log(resposta);

    if (resposta['erro']) {
        msgAlerta.innerHTML = resposta['msg'];
        setTimeout(() => {
            msgAlerta.innerHTML = "";
        }, 5000)
    } else {
        const editModal = new bootstrap.Modal(document.getElementById("editUsuarioModal"));
        editModal.show();
        document.getElementById("editid").value = resposta['dados'].id_form;
        document.getElementById("editnome").value = resposta['dados'].nome_form;
        document.getElementById("editemail").value = resposta['dados'].email_form;
        document.getElementById("edittelefone").value = resposta['dados'].telefone_form;
        document.getElementById("editduvida").value = resposta['dados'].duvida_form;
    }
}

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("edit-usuario-btn").value = "Salvando...";

    const dadosForm = new FormData(editForm);
    //console.log(dadosForm);
    /*for (var dadosFormEdit of dadosForm.entries()){
        console.log(dadosFormEdit[0] + " - " + dadosFormEdit[1]);
    }*/

    const dados = await fetch("editar.php", {
        method: "POST",
        body: dadosForm
    });

    const resposta = await dados.json();
    //console.log(resposta);

    if (resposta['erro']) {
        msgAlertaErroEdit.innerHTML = resposta['msg'];
        setTimeout(() => {
            msgAlertaErroEdit.innerHTML = "";
        }, 5000)
    } else {
        msgAlertaErroEdit.innerHTML = resposta['msg'];
        setTimeout(() => {
            msgAlertaErroEdit.innerHTML = "";
        }, 5000)
        listarUsuarios(1);
    }

    document.getElementById("edit-usuario-btn").value = "Salvar";
});

async function apagarProduto(id_produt) {

    var confirmar = confirm("Tem certeza que deseja excluir o registro selecionado?");

    if(confirmar == true){
        const dados = await fetch('apagar-produto.php?id_produt=' + id_produt);

        const resposta = await dados.json();
        if (resposta['erro']) {
            msgAlerta.innerHTML = resposta['msg'];
            setTimeout(() => {
                msgAlerta.innerHTML = "";
            }, 5000)
        } else {
            msgAlerta.innerHTML = resposta['msg'];
            setTimeout(() => {
                msgAlerta.innerHTML = "";
            }, 5000)
            listarProdutos(1);
           
        }
    }    

}

function mask(o, f) {
    setTimeout(function() {
      var v = mphone(o.value);
      if (v != o.value) {
        o.value = v;
      }
    }, 1);
  }
  
  function mphone(v) {
    var r = v.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length > 10) {
      r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 5) {
      r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
      r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
      r = r.replace(/^(\d*)/, "($1");
    }
    return r;
  }