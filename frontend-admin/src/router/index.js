import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";

const routes = [

	{
		path: "/",
		redirect: "/admin/login",
	},

	{
		path: "/admin/login",
		name: "AdminLogin",
		component: Login,
	},

	{
		path: "/",
		component: () => import("../layouts/SidebarOnlyLayout.vue"),
		meta: { requiresAuth: true },
		children: [
			{
				path: "/admin/dashboard",
				name: "AdminDashboard",
				component: () => import("../views/Dashboard.vue"),
			},
			{
				path: "/users/pegawai",
				name: "DataPegawai",
				component: () => import("../views/DataPegawai.vue"),
			},
			{
				path: "/users/peminjam",
				name: "DataPeminjam",
				component: () => import("../views/DataPeminjam.vue"),
			},
			{
				path: "/admin/profile",
				name: "Profile",
				component: () => import("../views/Profile.vue"),
			},
			{
				path: "/barang",
				name: "Barang",
				component: () => import("../views/Barang.vue"),
			},
			{
				path: "/peminjaman",
				name: "ManagementPeminjam",
				component: () => import("../views/ManagementPeminjam.vue"),
			},
			{
				path: "/admin/action-logs",
				name: "AdminActionLogs",
				component: () => import("../views/AdminActionLogs.vue"),
				meta: {
					requiresAuth: true,
					role: "super_admin",
				},
			},
			{
				path: "/referensi/prodi",
				name: "TabelRefProdi",
				component: () => import("../views/TabelRefProdi.vue"),
				meta: {
					requiresAuth: true,
					role: "super_admin",
				},
			},
			{
				path: "/referensi/kelas",
				name: "TabelRefKelas",
				component: () => import("../views/TabelRefKelas.vue"),
				meta: {
					requiresAuth: true,
					role: "super_admin",
				},
			},
			{
				path: "/laporan-masalah",
				name: "LaporanMasalah",
				component: () => import("../views/LaporanMasalah.vue"), // Pastikan kamu membuat file ini nanti!
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from) => {
	const token = localStorage.getItem("token");
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const isAuthenticated = !!token;

	// Cek apakah user adalah Admin/Pegawai (Role Id 1 s/d 4)
	const isAdmin = user.role_id <= 4;

	if (to.meta.requiresAuth && !isAuthenticated) {
		return { name: "AdminLogin" };
	}

	if (to.meta.requiresAuth && isAuthenticated && !isAdmin) {
		localStorage.clear();

		alert("Akses Ditolak: Halaman ini hanya untuk Admin/Pegawai");

		return { name: "AdminLogin" };
	}

	if (to.path === "/admin/login" && isAuthenticated && isAdmin) {
		return { name: "AdminDashboard" };
	}

	return true;
});

export default router;
