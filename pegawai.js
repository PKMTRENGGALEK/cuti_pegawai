const scriptURL =
  "https://script.google.com/macros/s/AKfycbx2a0Gl5vnebcGwgA83PvVkp2gJbeFuvzzbCHfcxoxOiZRiMv6Q7sEdWyEFoDckAV9R/exec";

let globalData = [];

$(document).ready(function () {
  showLoading();

  fetch(scriptURL)
    .then((res) => res.json())
    .then((data) => {
      globalData = data;
      renderTable(data);
      hideLoading();
      showSuccessToast("Data berhasil dimuat.");
    })
    .catch((err) => {
      console.error("Gagal mengambil data:", err);
      hideLoading();
    });

  // Submit Edit Form
  $("#editForm").on("submit", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Menyimpan...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const index = $("#editIndex").val();
    const updatedData = {
      action: "edit",
      index: index,
      NAMA: $("#editNama").val(),
      USERNAME: $("#editUsername").val(),
      NIP: $("#editNIP").val(),
      JABATAN: $("#editJabatan").val(),
      GOL: $("#editGol").val(),
      "Jabatan Tingkat": $("#editJabatanTingkat").val(),
      "JENJANG JABATAN": $("#editJenjang").val(),
    };

    const formData = new FormData();
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }

    fetch(scriptURL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        Swal.close(); // Tutup loading
        if (res.success) {
          showSuccessToast("Data berhasil diperbarui.");
          $("#editModal").modal("hide");

          globalData[index] = {
            ...globalData[index],
            ...updatedData,
          };
          renderTable(globalData);
        } else {
          Swal.fire("Gagal!", "Tidak dapat menyimpan data.", "error");
        }
      })
      .catch((err) => {
        Swal.close(); // Tutup loading
        console.error("Gagal menyimpan:", err);
        Swal.fire("Error!", "Terjadi kesalahan saat menyimpan.", "error");
      });
  });
});

// Render Tabel
function renderTable(data) {
  if ($.fn.DataTable.isDataTable("#karyawanTable")) {
    $("#karyawanTable").DataTable().destroy();
  }

  let tableBody = "";
  data.forEach((row, index) => {
    tableBody += `
      <tr>
        <td>${index + 1}</td>
        <td>${row["NAMA"]}</td>
        <td>${row["USERNAME"]}</td>
        <td>${row["NIP"]}</td>
        <td>${row["JABATAN"]}</td>
        <td>${row["GOL"]}</td>
        <td>${row["Jabatan Tingkat"]}</td>
        <td>${row["JENJANG JABATAN"]}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editData(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteData(${index})">Hapus</button>
        </td>
      </tr>`;
  });

  $("#karyawanTable tbody").html(tableBody);
  $("#karyawanTable").DataTable();
}

// Buka Modal Edit
function editData(index) {
  const row = globalData[index];
  $("#editIndex").val(index);
  $("#editNama").val(row["NAMA"]);
  $("#editUsername").val(row["USERNAME"]);
  $("#editNIP").val(row["NIP"]);
  $("#editJabatan").val(row["JABATAN"]);
  $("#editGol").val(row["GOL"]);
  $("#editJabatanTingkat").val(row["Jabatan Tingkat"]);
  $("#editJenjang").val(row["JENJANG JABATAN"]);
  $("#editModal").modal("show");
}

// Hapus Data
function deleteData(index) {
  const row = globalData[index];
  Swal.fire({
    title: `Hapus data ${row["NAMA"]}?`,
    text: "Data akan dihapus dari Google Sheet.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Menghapus...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("index", index);

      fetch(scriptURL, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((data) => {
          Swal.close(); // Tutup loading
          const res = JSON.parse(data);
          if (res.success) {
            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
            globalData.splice(index, 1); // Hapus dari array lokal
            renderTable(globalData); // Render ulang
          } else {
            Swal.fire("Gagal!", "Data tidak bisa dihapus.", "error");
          }
        })
        .catch((err) => {
          Swal.close();
          Swal.fire("Error!", "Gagal menghapus data.", "error");
          console.error(err);
        });
    }
  });
}

// Tampilkan Toast
function showSuccessToast(msg) {
  $("#toastBody").text(msg);
  const toastEl = document.getElementById("successToast");
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

// Loading Spinner
function showLoading() {
  $("#karyawanTable tbody").html(
    `<tr><td colspan="9" class="text-center">Memuat data...</td></tr>`
  );
}
function hideLoading() {
  // Tidak perlu diisi karena renderTable akan overwrite
}

$("#addForm").on("submit", function (e) {
  e.preventDefault();

  Swal.fire({
    title: "Menyimpan...",
    text: "Mohon tunggu sebentar",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const newData = {
    action: "add",
    NAMA: $("#addNama").val(),
    USERNAME: $("#addUsername").val(),
    NIP: $("#addNIP").val(),
    JABATAN: $("#addJabatan").val(),
    GOL: $("#addGol").val(),
    "Jabatan Tingkat": $("#addJabatanTingkat").val(),
    "JENJANG JABATAN": $("#addJenjang").val(),
  };

  const formData = new FormData();
  for (const key in newData) {
    formData.append(key, newData[key]);
  }

  fetch(scriptURL, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      Swal.close();
      if (res.success) {
        showSuccessToast("Data berhasil ditambahkan.");
        $("#addModal").modal("hide");

        // Tambahkan ke globalData dan render ulang tabel
        globalData.push({
          NAMA: newData.NAMA,
          USERNAME: newData.USERNAME,
          NIP: newData.NIP,
          JABATAN: newData.JABATAN,
          GOL: newData.GOL,
          "Jabatan Tingkat": newData["Jabatan Tingkat"],
          "JENJANG JABATAN": newData["JENJANG JABATAN"],
        });

        renderTable(globalData);

        // Reset form setelah submit
        $("#addForm")[0].reset();
      } else {
        Swal.fire("Gagal!", "Tidak dapat menambahkan data.", "error");
      }
    })
    .catch((err) => {
      Swal.close();
      console.error("Gagal menambahkan:", err);
      Swal.fire("Error!", "Terjadi kesalahan saat menambahkan.", "error");
    });
});
