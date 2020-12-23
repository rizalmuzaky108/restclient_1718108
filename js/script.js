const baseUrl = "http://127.0.0.1:8000/api/";
const allEndPoin = `${baseUrl}Baju`;

const contents = document.querySelector("#content-list");
const tableRows = document.querySelector("#tableBody");
const title = document.querySelector(".card-title");

function getAllBaju() {
    title.innerHTML = "Daftar Baju";

    fetch(allEndPoin)
        .then(response => response.json())
        .then(resJson => {
            let datas = "";
            resJson.data.forEach(data => {
                datas += `
                    <tr>
                        <td>${data.id}</td>
                        <td>${data.merek}
                        <td>${data.nama}</td>
                        <td>${data.jenis}</td>
                        <td>${data.ukuran}</td>
                        <td>Rp.${data.harga}</td>                        
                        <td>
                            <a onclick="editBaju(${data.id})" class="waves-effect waves-light btn-small">
                                <i class="material-icons">create</i>
                            </a>
                            <a onclick="deleteBaju(${data.id})" class="waves-effect waves-light btn-small red">
                                <i class="material-icons">delete</i>
                            </a>
                        </td>
                    </tr>`
            });
            tableRows.innerHTML = `${datas}`;
        }).catch(err => {
            console.error(err);
        })
}

function getBajuByJenis(jenisBaju) {
    title.innerHTML = `Daftar Baju ${jenisBaju}`;
    fetch(allEndPoin)
        .then(response => response.json())
        .then(resJson => {
            let datas = "";
            resJson.data.forEach(data => {
                if(data.jenis == jenisBaju) {
                datas += `
                    <tr>
                        <td>${data.id}</td>
                        <td>${data.merek}
                        <td>${data.nama}</td>
                        <td>${data.jenis}</td>
                        <td>Size${data.ukuran}</td>
                        <td>Rp.${data.harga}</td>
                        <td>
                            <a onclick="editBaju(${data.id})" class="waves-effect waves-light btn-small blue">
                                <i class="material-icons">create</i>
                            </a>
                            <a onclick="deleteBaju(${data.id})" class="waves-effect waves-light btn-small orange">
                                <i class="material-icons">delete</i>
                            </a>
                        </td>
                    </tr>`
                }
            });
            tableRows.innerHTML = `${datas}`;
        }).catch(err => {
            console.error(err);
        })
}

function saveData() {
    let methodRequest = 'POST';
    let id = document.querySelector('#idInput').value;
    let merek = document.querySelector('#merekInput').value;
    let nama = document.querySelector('#namaInput').value;
    let jenis = document.querySelector('#jenisInput').value;
    let ukuran = document.querySelector('#ukuranInput').value;
    let harga = document.querySelector('#hargaInput').value;
    
    let url = '';

    if (id.length > 0) {
        url = allEndPoin+'/update'+id;
        methodRequest = 'PUT';
    }
    else url = allEndPoin;
    fetch(url, { 
            method: methodRequest,
            body: new URLSearchParams({
                    "id": id,
                    "merek": merek,
                    "nama": nama,
                    "jenis": jenis,
                    "ukuran": ukuran,
                    "harga": harga,                    
                }),
            headers: {
               'Content-ukuran': 'application/x-www-form-urlencoded'
            } 
        })
        .then(response => response.json())
        .then(resJson => {
            if(resJson.status) {
                M.toast({html: resJson.message});
                cancelForm();
                refreshTable();

            } else {
                M.toast({html: resJson.message, classes: 'orange'});
            }

        }).catch(err => {
            console.error(err);
        })
}

function editBaju(id) {
    fetch(allEndPoin+'/'+id)
        .then(response => response.json())
        .then(resJson => {
            if(resJson.status) {
                console.log(resJson)
                    document.querySelector('#idInput').value = resJson.data.id;
                    document.querySelector('#merekInput').value = resJson.data.merek;
                    document.querySelector('#namaInput').value = resJson.data.nama;
                    document.querySelector('#jenisInput').value = resJson.data.jenis;
                    document.querySelector('#ukuranInput').value = resJson.data.ukuran;
                    document.querySelector('#hargaInput').value = resJson.data.harga;
                    
                showForm();
                title.innerHTML = "Edit Data Baju";

            } else {
                M.toast({html: resJson.message, classes: 'orange'});
            }
        }).catch(err => {
            console.error(err);
        })
}

function deleteBaju(id) {
    fetch(allEndPoin +'/delete'+id, { 
        method: 'DELETE',
        body: new URLSearchParams({
                "id": id,
            }),
        headers: {
           'Content-ukuran': 'application/x-www-form-urlencoded'
        } 
    })
    .then(response => response.json())
    .then(resJson => {
        if(resJson.status) {
            M.toast({html: resJson.message});
            refreshTable();

        } else {
            M.toast({html: resJson.message, classes: 'orange'});
        }

    }).catch(err => {
        console.error(err);
    })
}

function hideForm() {
    title.innerHTML = "Daftar Baju";
    document.querySelector('#formBajuWrapper').style.display = "none";
    document.querySelector('#btnAdd').style.display = "block";
    document.querySelector('#tabelBaju').style.display = "";
    document.querySelector('#idInput').value = '';
}

function showForm() {
    title.innerHTML = "Tambah Data Baju";
    document.querySelector('#formBajuWrapper').style.display = "block";
    document.querySelector('#btnAdd').style.display = "none";
    document.querySelector('#tabelBaju').style.display = "none";
}

function cancelForm() {
    title.innerHTML = "Daftar Baju";
    document.querySelector('#formBaju').reset();
    document.querySelector('#idInput').value = '';
    hideForm();
}

function refreshTable() {
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "daftarBaju";
    loadPage(page);
}

function loadPage(page) {
    switch (page) {
        case "daftarBaju":
            getAllBaju();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    cancelForm();
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
        elm.addEventListener("click", evt => {
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })
    })
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "daftarBaju";
    loadPage(page);
});