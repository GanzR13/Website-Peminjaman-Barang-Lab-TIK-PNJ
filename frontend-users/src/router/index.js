import { createRouter, createWebHistory } from "vue-router";

import UserLayout from "../layouts/UserLayout.vue";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Beranda from "../views/Beranda.vue";
import Profile from "../views/Profile.vue";
import CatalogBarang from "../views/CatalogBarang.vue";
import RiwayatPeminjaman from "../views/RiwayatPeminjaman.vue";

const routes = [
	{
		path: "/",
		redirect: "/beranda",
	},

	{
		path: "/login",
		name: "Login",
		component: Login,
		meta: { guestOnly: true },
	},
	{
		path: "/register",
		name: "Register",
		component: Register,
		meta: { guestOnly: true },
	},

	{
		path: "/user",
		component: UserLayout,
		meta: { requiresAuth: true },
		children: [
			{
				path: "/beranda",
				name: "Beranda",
				component: Beranda,
			},
			{
				path: "/profile",
				name: "Profile",
				component: Profile,
			},
			{
				path: "/catalog",
				name: "Catalog",
				component: CatalogBarang,
			},
			{
				path: "/riwayat",
				name: "RiwayatPeminjaman",
				component: RiwayatPeminjaman,
			},
			{
				path: "/approval-dosen",
				name: "ApprovalDosen",
				component: () => import("../views/ApprovalDosen.vue"),
				meta: {
					requiresAuth: true,
					onlyDosen: true,
				},
			},
		],
	},

	{
		path: "/:pathMatch(.*)*",
		redirect: "/beranda",
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const getStoredUser = () => {
	try {
		return JSON.parse(localStorage.getItem("user") || "{}");
	} catch (error) {
		localStorage.removeItem("user");
		return {};
	}
};

const normalizeText = (value) => {
	return String(value || "")
		.trim()
		.toLowerCase()
		.replaceAll(" ", "_");
};

const isUserPeminjamPortal = (user) => {
	const roleId = Number(user.role_id || user.role?.id);
	const roleName = normalizeText(
		user.role_name ||
			user.nama_role ||
			user.role?.nama_role
	);

	const level = normalizeText(
		user.level_akses ||
			user.level ||
			user.role?.level_akses
	);

	return (
		roleId === 4 ||
		roleId === 5 ||
		roleName === "mahasiswa" ||
		roleName === "dosen" ||
		level === "peminjam"
	);
};

const isUserDosen = (user) => {
	const roleId = Number(user.role_id || user.role?.id);
	const roleName = normalizeText(
		user.role_name ||
			user.nama_role ||
			user.role?.nama_role
	);

	return roleId === 4 || roleName === "dosen";
};

router.beforeEach((to) => {
	const token = localStorage.getItem("token");
	const user = getStoredUser();
	const isAuthenticated = !!token;

	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
	const guestOnly = to.matched.some((record) => record.meta.guestOnly);

	const isPeminjam = isUserPeminjamPortal(user);
	const isDosen = isUserDosen(user);

	if (requiresAuth && !isAuthenticated) {
		return { name: "Login" };
	}

	if (requiresAuth && isAuthenticated && !isPeminjam) {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.removeItem("cart_peminjaman");

		alert("Akses ditolak. Silakan gunakan Portal Admin untuk mengelola sistem.");

		return { name: "Login" };
	}

	if (to.meta.onlyDosen && !isDosen) {
		alert("Akses ditolak. Halaman approval hanya dapat diakses oleh akun Dosen.");
		return { name: "Beranda" };
	}

	if (guestOnly && isAuthenticated) {
		if (isPeminjam) {
			return { name: "Beranda" };
		}

		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.removeItem("cart_peminjaman");

		return { name: "Login" };
	}

	return true;
});

export default router;