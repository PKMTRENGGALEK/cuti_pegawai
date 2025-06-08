// Load Firebase JS SDK jika belum ada
if (typeof firebase === "undefined") {
  const script1 = document.createElement("script");
  script1.src = "https://www.gstatic.com/firebasejs/11.9.0/firebase-app-compat.js";
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.src = "https://www.gstatic.com/firebasejs/11.9.0/firebase-database-compat.js";
  script2.onload = initFirebase;
  document.head.appendChild(script2);
} else {
  initFirebase();
}

function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyDobYAus7ii0oBKnjxYd_4Lzybf9_K3Q70",
    authDomain: "dbpegawai-2ce18.firebaseapp.com",
    projectId: "dbpegawai-2ce18",
    storageBucket: "dbpegawai-2ce18.appspot.com",
    messagingSenderId: "243770166322",
    appId: "1:243770166322:web:5fd735ec229c87e715c02b",
    databaseURL: "https://dbpegawai-2ce18-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  const refPegawai = db.ref(); // root

  // 🔁 Load Data Pegawai
  refPegawai.once('value', (snapshot) => {
    const tbody = $('#pegawaiTable tbody');
    tbody.empty();

    snapshot.forEach((childSnap) => {
      const data = childSnap.val();
      const key = childSnap.key;
      tbody.append(`
        <tr>
          <td>${data.Nama || '-'}</td>
          <td>${data.NIP || '-'}</td>
          <td>${data.Jabatan || '-'}</td>
          <td>${data.Golongan || '-'}</td>
          <td>
            <button class="btn btn-sm btn-warning btn-edit" data-id="${key}">Edit</button>
            <button class="btn btn-sm btn-danger btn-delete" data-id="${key}">Hapus</button>
          </td>
        </tr>
      `);
    });

    $('#pegawaiTable').DataTable();
  });

  // ✅ Tambah / Edit Data
  $('#formPegawai').on('submit', function (e) {
    e.preventDefault();
    const id = $('#pegawaiId').val();
    const data = {
      Nama: $('#nama').val(),
      NIP: $('#nip').val(),
      Jabatan: $('#jabatan').val(),
      Golongan: $('#golongan').val(),
    };

    const targetRef = id ? db.ref(id) : db.ref().push();
    targetRef.set(data).then(() => {
      $('#pegawaiModal').modal('hide');
      location.reload();
    });
  });

  // ✏️ Isi form saat klik Edit
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    db.ref(id).once('value').then((snap) => {
      const d = snap.val();
      $('#pegawaiId').val(id);
      $('#nama').val(d.Nama || '');
      $('#nip').val(d.NIP || '');
      $('#jabatan').val(d.Jabatan || '');
      $('#golongan').val(d.Golongan || '');
      const modal = new bootstrap.Modal(document.getElementById('pegawaiModal'));
      modal.show();
    });
  });

  // 🗑️ Hapus data
 // Hapus pakai SweetAlert
$(document).on('click', '.btn-delete', function () {
  const id = $(this).data('id');
  Swal.fire({
    title: 'Yakin hapus?',
    text: 'Data akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      remove(ref(db, id)).then(() => {
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
        setTimeout(() => location.reload(), 1000);
      });
    }
  });
});

}
// Tampilkan data ke modal Edit
$(document).on('click', '.btn-edit', function () {
  const id = $(this).data('id');
  get(ref(db, id)).then((snap) => {
    const d = snap.val();
    $('#pegawaiIdEdit').val(id);
    $('#namaEdit').val(d.Nama);
    $('#nipEdit').val(d.NIP);
    $('#jabatanEdit').val(d.Jabatan);
    $('#golonganEdit').val(d.Golongan);
    const modal = new bootstrap.Modal(document.getElementById('pegawaiModalEdit'));
    modal.show();
  });
});

// Proses submit Edit
$('#formPegawaiEdit').on('submit', function (e) {
  e.preventDefault();
  const id = $('#pegawaiIdEdit').val();
  const data = {
    Nama: $('#namaEdit').val(),
    NIP: $('#nipEdit').val(),
    Jabatan: $('#jabatanEdit').val(),
    Golongan: $('#golonganEdit').val()
  };
  const targetRef = ref(db, id);
  set(targetRef, data).then(() => {
    $('#pegawaiModalEdit').modal('hide');
    Swal.fire('Berhasil!', 'Data berhasil diperbarui.', 'success');
    setTimeout(() => location.reload(), 1000);
  });
});
