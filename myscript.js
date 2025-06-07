function showSuccessToast() {
  const toastEl = document.getElementById('successToast');
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}
$(document).ready(function () {

  // Fungsi inisialisasi komponen setelah load halaman
  function initComponents() {
    // Inisialisasi Flatpickr
    flatpickr(".flatpickr", {
      dateFormat: "Y-m-d"
    });

    // (Opsional) Inisialisasi komponen lain di halaman jika perlu
  }

  // Fungsi untuk memuat konten berdasarkan nama halaman
  function loadPage(page) {
    $("#content").html("<div class='text-center'><p>Loading...</p></div>");
    $("#content").load(`pages/${page}.html`, function (response, status, xhr) {
      if (status === "error") {
        $("#content").html(`
          <div class='container shadow text-center mt-4 bg-white'>
            <br>
            <img src='https://i.pinimg.com/originals/db/04/00/db0400868e5aac451726ad8bb0f9a8f2.gif' alt='Not found' width='600' height='440'>
            <p class='mt-2'>Halaman tidak ditemukan.</p>
          </div>`);
      } else {
        // Inisialisasi ulang komponen setelah halaman dimuat
        initComponents();
      }
    });
  }
 
  // Event klik pada navigasi
  $("nav a").on("click", function () {
    const page = $(this).data("page");

    // Tambahkan dan hapus class 'active'
    $("nav a").removeClass("active");
    $(this).addClass("active");

    // Load halaman
    loadPage(page);
  });

  // Load default halaman
  loadPage("dashboard");

  // Sidebar toggle untuk mobile
  $('#toggleSidebar').on('click', function () {
    $('#sidebar').toggleClass('show');
  });

  // Tutup sidebar otomatis saat link di sidebar diklik (mode mobile)
  $('.sidebar .nav-link').on('click', function () {
    if (window.innerWidth <= 768) {
      $('#sidebar').removeClass('show');
    }
  });

});
