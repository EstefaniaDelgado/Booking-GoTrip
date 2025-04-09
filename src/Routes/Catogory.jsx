import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import RecomendadosCard from "../views/Home/components/RecomendadosCard";
import { EventContext } from "../context/ProductContext";
import Header from "../components/Header";
import { getFavoritesProducts } from "../services/favoritesServie";
import GlobalWhatsAppContactButton from "../views/Home/components/GlobalWhatsAppContactButton";

const Category = () => {
  const { events, fetchEvents, isLoading } = useContext(EventContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  /* Funcionalidad de Favoritos */
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("userGoTrip")) || {};
  const idUser = storedUser?.user?.id;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get("filter");

  const apiUrl =
    import.meta.env.VITE_API_URL_DEVELOPMENT ||
    import.meta.env.VITE_API_URL_PRODUCTION;

  const [searchParams, setSearchParams] = useState({
    name: "",
    dateRange: [],
  });

  useEffect(() => {
    fetch(`${apiUrl}/categorias`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error obteniendo categorías:", error));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (filterParam) {
      setSelectedCategories([Number(filterParam)]);
    }
  }, [filterParam]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const nameParam = queryParams.get("name");
    const startDateParam = queryParams.get("startDate");
    const endDateParam = queryParams.get("endDate");

    // Establecer los filtros iniciales
    setSearchParams((prevParams) => ({
      ...prevParams,
      name: nameParam || "",
      dateRange:
        startDateParam && endDateParam
          ? [
              {
                startDate: new Date(startDateParam),
                endDate: new Date(endDateParam),
                key: "selection",
              },
            ]
          : [],
    }));
  }, [location.search]);

  useEffect(() => {
    //console.log(events);
    let filtered = events;

    // Filtrar por categorías
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (event) =>
          event.categoryOutputDTO?.id_category &&
          selectedCategories.includes(event.categoryOutputDTO.id_category)
      );
    }

    // Filtrar por nombre
    if (searchParams.name) {
      //console.log("Nombre buscado:", searchParams.name);

      filtered = filtered.filter((product) => {
        return (
          product.name &&
          typeof product.name === "string" &&
          product.name
            .trim()
            .toLowerCase()
            .includes(searchParams.name.trim().toLowerCase())
        );
      });
    }

    // Filtrar por fechas
    if (searchParams.dateRange.length > 0) {
      const { startDate, endDate } = searchParams.dateRange[0];

      filtered = filtered.filter((product) => {
        const productStartDate = new Date(product.fechaInicio);
        const productEndDate = new Date(product.fechaFin);

        // Normalizar las fechas para comparar solo la parte de fecha (sin hora)
        const normalizedStartDate = new Date(
          productStartDate.setHours(0, 0, 0, 0)
        );
        const normalizedEndDate = new Date(
          productEndDate.setHours(23, 59, 59, 999)
        );

        const queryStartDate = new Date(startDate.setHours(0, 0, 0, 0));
        const queryEndDate = new Date(endDate.setHours(23, 59, 59, 999));

        return (
          (normalizedStartDate >= queryStartDate &&
            normalizedStartDate <= queryEndDate) ||
          (normalizedEndDate >= queryStartDate &&
            normalizedEndDate <= queryEndDate)
        );
      });
    }

    setFilteredProducts(filtered);
  }, [selectedCategories, searchParams, events]);

  /* Funcionalidad de Favoritos */
  useEffect(() => {
    const fecthApi = async () => {
      try {
        const data = await getFavoritesProducts(idUser);
        setFavorites(data);
      } catch (error) {
        console.log("Ha ocurrido un error al intentar traer favoritos", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };
    if (idUser) {
      fecthApi();
    }
  }, [idUser]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    // <div >
    <div className="pb-8">
      {/* <section className="relative min-h-[400px] md:h-[400px] w-full bg-cover bg-center"> */}
      <section className="relative w-full bg-cover bg-center ">
        <Header />
      </section>
      <div className="w-full mt-5 p-4 text-center">
        {/* Filtros de categorías */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <div
              key={category.id_category}
              className="flex items-center border border-[#3C6E71] bg-white rounded-lg px-4 py-2 gap-2"
            >
              <label
                htmlFor={`category-${category.id_category}`}
                className="text-[#3C6E71] font-semibold cursor-pointer"
                onClick={() => handleCategoryChange(category.id_category)}
              >
                {category.name}
              </label>
              {selectedCategories.includes(category.id_category) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategories((prevSelected) =>
                      prevSelected.filter((id) => id !== category.id_category)
                    );
                  }}
                  className="text-[#3C6E71] ml-2"
                >
                  <img
                    src="/close.svg"
                    alt="Eliminar filtro"
                    className="w-4 h-4"
                  />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Botón de limpiar filtros */}
        <div className="mt-6">
          <button
            onClick={clearFilters}
            className="bg-[#3C6E71] text-white px-4 py-2 rounded"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Mensaje de resultados encontrados */}
        <div className="mt-6 text-[#3C6E71] text-lg font-semibold">
          {isLoading ? (
            <p>Cargando eventos...</p>
          ) : (
            <p>
              ¡Se encontraron {filteredProducts.length} productos de un total de{" "}
              {events.length} disponibles!
            </p>
          )}
        </div>

        {/* Productos filtrados */}
        {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> */}
        <div className="mx-auto w-full max-w-screen-2xl mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((event) => (
            <RecomendadosCard
              key={event.id}
              event={event}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          ))}
        </div>
      </div>
      <GlobalWhatsAppContactButton message="Quiero saber más sobre las categorias y tengo algunas preguntas. ¿Pueden ayudarme?" />
    </div>
  );
};

export default Category;
