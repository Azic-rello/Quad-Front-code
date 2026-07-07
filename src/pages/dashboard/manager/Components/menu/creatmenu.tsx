import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:3000";
const API_URL = `${API_BASE_URL}/products`;
const MAX_PRISMA_INT = 2_147_483_647;

const normalizePrice = (value: string): number | null => {
  const trimmed = value.replace(/,/g, "").trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || !Number.isSafeInteger(parsed)) return null;
  if (parsed <= 0 || parsed > MAX_PRISMA_INT) return null;

  return parsed;
};

const getErrorMessage = (error: unknown): string => {
  const responseData = (error as any)?.response?.data;
  if (typeof responseData === "string") return responseData;
  if (responseData?.message) return responseData.message;
  if (responseData?.error) return responseData.error;
  return (error as any)?.message || "Unexpected error";
};

interface Category {
  id: string;
  name: string;
}

interface FoodItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  categoryId: string;
  image: string;
  description: string;
}

const CreateMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState<string>("all");

  // Form statelari
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  // 🔥 Robust token resolution (JWT / NestJS JwtAuthGuard uchun Bearer header)
  const getAuthHeader = (): Record<string, string> => {
    const normalizeToken = (raw: unknown): string => {
      if (raw == null) return "";
      let token = String(raw).trim();

      // JSON.stringify ba'zan tokenni "eyJ..." ko'rinishida aynan qo'shtirnoq bilan qaytaradi
      token = token.replace(/^"+|"+$/g, "").trim();

      // Ba'zi holatlarda "Bearer eyJ..." ko'rinishida kelishi mumkin
      token = token.replace(/^Bearer\s+/i, "").trim();

      return token;
    };

    const isJwtLike = (token: string) => {
      // JWT odatda eyJ... (base64url) bilan boshlanadi
      return (
        token.length > 10 && (token.startsWith("eyJ") || token.includes("."))
      );
    };

    const tryParseJson = (value: string): any => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    };

    const candidateKeys = [
      "token",
      "accessToken",
      "access_token",
      "auth",
      "user",
      "currentUser",
    ];

    // 1) direct tokens: localStorage.getItem("token"/"accessToken"/etc)
    for (const key of candidateKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const direct = normalizeToken(raw);
      if (isJwtLike(direct)) return { Authorization: `Bearer ${direct}` };

      // 2) deep parse: localStorage "auth"/"user" may be stringified object
      const parsed = tryParseJson(raw);
      if (!parsed) continue;

      const directToken =
        parsed?.token ??
        parsed?.accessToken ??
        parsed?.access_token ??
        parsed?.access?.token ??
        parsed?.access?.accessToken;

      const normalized = normalizeToken(directToken);
      if (isJwtLike(normalized))
        return { Authorization: `Bearer ${normalized}` };
    }

    // 3) fallback: scan localStorage values (last resort)
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;

      const raw = localStorage.getItem(k);
      if (!raw) continue;

      // Quick jwt-ish detection
      if (raw.includes("eyJ") || raw.includes(".")) {
        const normalized = normalizeToken(raw);
        if (isJwtLike(normalized))
          return { Authorization: `Bearer ${normalized}` };

        const parsed = tryParseJson(raw);
        if (parsed) {
          const directToken =
            parsed?.token ??
            parsed?.accessToken ??
            parsed?.access_token ??
            parsed?.user?.token ??
            parsed?.user?.accessToken;

          const normalized2 = normalizeToken(directToken);
          if (isJwtLike(normalized2))
            return { Authorization: `Bearer ${normalized2}` };
        }
      }
    }

    console.warn(
      "[CreateMenu] Authentication token topilmadi. Sessiya unauthenticated bo'lishi mumkin (401 bo'ladi).",
    );

    return {};
  };

  // 1. Ma'lumotlarni yuklash (401 ni UI bilan handle qilish)
  const fetchData = async () => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories`, {
          headers: getAuthHeader(),
          withCredentials: true,
        }),
        axios.get(`${API_URL}?page=1&limit=100`, {
          headers: getAuthHeader(),
          withCredentials: true,
        }),
      ]);

      const categoriesData = Array.isArray(categoriesResponse.data)
        ? categoriesResponse.data
        : categoriesResponse.data?.data || categoriesResponse.data?.items || [];
      const productsData = productsResponse.data;

      setCategories(categoriesData);

      if (productsData) {
        if (Array.isArray(productsData)) {
          setFoods(productsData);
        } else if (productsData.items && Array.isArray(productsData.items)) {
          setFoods(productsData.items);
        } else if (productsData.data && Array.isArray(productsData.data)) {
          setFoods(productsData.data);
        } else {
          setFoods([]);
        }
      } else {
        setFoods([]);
      }
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        console.warn(
          "[CreateMenu] 401 Unauthorized. Sessiya muddati tugagan bo'lishi mumkin.",
          error,
        );

        alert("Sessiya muddati tugadi. Iltimos, qaytadan tizimga kiring.");

        setCategories([]);
        setFoods([]);
        return;
      }

      console.error("Taomlarni yuklashda xatolik:", error);
      setCategories([]);
      setFoods([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCategoryId = categoryId.trim();
    const normalizedPrice = normalizePrice(price);

    if (!trimmedName || !trimmedCategoryId) {
      return alert("Majburiy maydonlarni to'ldiring!");
    }

    const categoryExists = categories.some(
      (cat) => String(cat.id) === String(trimmedCategoryId),
    );
    if (!categoryExists) {
      return alert(
        "Tanlangan kategoriya bazada topilmadi! Iltimos, kategoriyani qayta tanlang yoki yangi kategoriya yarating.",
      );
    }

    if (normalizedPrice === null) {
      return alert(
        "Narx noto'g'ri. Iltimos 1 dan 2,147,483,647 gacha bo'lgan butun son kiriting.",
      );
    }

    setLoading(true);

    const payload = {
      name: trimmedName,
      slug: slug.trim(),
      price: normalizedPrice,
      categoryId: trimmedCategoryId,
      image: image.trim() || "https://placehold.co/600x400?text=No+Image",
      description: description.trim(),
    };

    try {
      const requestConfig = {
        headers: getAuthHeader(),
        withCredentials: true,
      };

      if (editingId) {
        await axios.patch(`${API_URL}/${editingId}`, payload, requestConfig);
        alert("Taom muvaffaqiyatli tahrirlandi! 📝");
      } else {
        await axios.post(API_URL, payload, requestConfig);
        alert("Taom muvaffaqiyatli qo'shildi! 🎉");
      }

      setEditingId(null);
      setName("");
      setSlug("");
      setPrice("");
      setCategoryId("");
      setImage("");
      setDescription("");
      await fetchData();
    } catch (error: unknown) {
      console.error("Taom saqlashda xatolik:", error);
      const errorMessage = getErrorMessage(error).toLowerCase();
      const status = (error as any)?.response?.status;

      if (
        status === 404 ||
        (errorMessage.includes("category") &&
          errorMessage.includes("not found"))
      ) {
        alert(
          "Tanlangan kategoriya bazada topilmadi! Iltimos, kategoriyani qayta tanlang yoki yangi kategoriya yarating.",
        );
      } else {
        alert(`Saqlashda xatolik: ${getErrorMessage(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setName(item.name);
    setSlug(item.slug);
    setPrice(item.price.toString());
    setCategoryId(item.categoryId);
    setImage(item.image);
    setDescription(item.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Rostdan ham bu taomni o'chirib tashlamoqchimisiz?"))
      return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      alert("Taom o'chirildi! 🗑️");
      fetchData();
    } catch (error: any) {
      alert("O'chirish imkoni bo'lmadi.");
    }
  };

  const filteredFoods =
    selectedFilterCategory === "all"
      ? foods
      : foods.filter((food) => food.categoryId === selectedFilterCategory);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg">
        <h2 className="text-center text-2xl font-black text-slate-800 mb-6">
          {editingId ? "Taomni Tahrirlash" : "Yangi Taom Qo'shish"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Taom Nomi *
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={slug}
                readOnly
                className="w-full bg-slate-100 border border-slate-200 text-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Narxi (UZS) *
              </label>
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="1"
                max={MAX_PRISMA_INT}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategoriya Tanlang *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              >
                <option value="">-- Tanlang --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rasm URL
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tavsif
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm cursor-pointer"
          >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            🍱 Mavjud Taomlar Ro'yxati
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-red-500"
            >
              <option value="all">🌐 Hammasi</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  📁 {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredFoods.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Hozircha mahsulot yo'q yoki yuklanmadi.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-100">
                  <th className="p-4">Rasm</th>
                  <th className="p-4">Nomi</th>
                  <th className="p-4">Narxi</th>
                  <th className="p-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {filteredFoods.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4 font-semibold">{item.name}</td>
                    <td className="p-4">{item.price.toLocaleString()} UZS</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg cursor-pointer"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMenu;
