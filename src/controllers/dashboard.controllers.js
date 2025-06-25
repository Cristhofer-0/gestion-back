import {
  sumarIngresosPagados,
  contarOrdenesPagadas,
  calcularCambioIngresos
} from '../services/orderService.js';

// ✅ GET /api/ingresos-generales
export const getIngresosGenerales = async (req, res) => {
  try {
    const { range } = req.query;
    const total = await sumarIngresosPagados(range);

    res.status(200).json({
      message: `Ingresos generales para el rango: ${range || 'all'}`,
      total
    });
  } catch (error) {
    console.error("Error al obtener ingresos generales:", error);
    res.status(500).json({ message: 'Error al obtener los ingresos generales' });
  }
};

// ✅ GET /api/ordenes-pagadas
export const getCantidadOrdenesPagadas = async (req, res) => {
  try {
    const { range } = req.query;
    const count = await contarOrdenesPagadas(range);

    res.status(200).json({
      message: `Cantidad de órdenes pagadas (${range || 'all'})`,
      count
    });
  } catch (error) {
    console.error('Error al contar órdenes pagadas:', error);
    res.status(500).json({ error: 'Error al contar órdenes pagadas' });
  }
};

export const getPorcentajeCambioIngresos = async (req, res) => {
  try {
    const { range } = req.query;

    const change = await calcularCambioIngresos(range);

    res.status(200).json({ change });
  } catch (error) {
    console.error("❌ Error al calcular el porcentaje de cambio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
