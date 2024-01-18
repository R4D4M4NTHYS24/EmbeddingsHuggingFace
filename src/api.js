import pnp from "sp-pnp-js";
import { setup } from "sp-pnp-js";

setup({
  sp: {
    baseUrl:
      "https://secol-my.sharepoint.com/personal/crestrepo_sistemas-expertos_com/Lists",
  },
});

export const getListItems = async () => {
  try {
    const listTitle = "embeddings";
    const responseData = await pnp.sp.web.lists
      .getByTitle(listTitle)
      .items.get();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    throw error;
  }
};

export const addItem = async (item) => {
  console.log(item);
  try {
    const list = pnp.sp.web.lists.getByTitle("embeddings");

    const response = await list.items.add({
      Title: item.title,
      NombreProyecto: item.nombreProyecto,
      LiderFuncional: item.liderFuncional,
      Patrocinador: item.patrocinador,
      Presupuesto: item.presupuesto,
      Alcance: item.alcance,
      Estado: item.estado,
      Sede: item.sede,
      Descripcion: item.descripcion,
      Patrocinadora: item.patrocinadora,
      Prioridad: item.prioridad,
      FechaInicio: item.fechaInicio,
      FechaFin: item.fechaFin,
    });

    console.log(response.data);
    return response.data; // Devuelve la respuesta completa en lugar de solo el ID
  } catch (error) {
    console.error("Error al agregar el elemento:", error);
    throw error;
  }
};

export const updateItem = async (itemId, item) => {
  try {
    const list = pnp.sp.web.lists.getByTitle("embeddings");
    await list.items.getById(itemId).update(item);
  } catch (error) {
    console.error("Error al actualizar el elemento:", error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const list = pnp.sp.web.lists.getByTitle("embeddings");
    await list.items.getById(itemId).delete();
  } catch (error) {
    console.error("Error al eliminar el elemento:", error);
    throw error;
  }
};
