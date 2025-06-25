import Order from '../models/Order/Order.js';
import { literal, Op } from 'sequelize';

export const toSqlDateTimeString = (date) => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

export const getRange = (range) => {
  const now = new Date();
  let fromDate;

  if (range && range !== 'all') {
    fromDate = new Date();

    if (range.endsWith('d')) {
      const days = parseInt(range);
      fromDate.setDate(now.getDate() - days);
    } else if (range.endsWith('m')) {
      const months = parseInt(range);
      fromDate.setMonth(now.getMonth() - months);
    }

    fromDate.setHours(0, 0, 0, 0);
    now.setHours(23, 59, 59, 999);

    const from = toSqlDateTimeString(fromDate);
    const to = toSqlDateTimeString(now);

    return literal(`[OrderDate] BETWEEN '${from}' AND '${to}'`);
  }

  return null;
};

export const sumarIngresosPagados = async (range = null, customCondition = null) => {
  const dateCondition = customCondition || getRange(range);

  const ingresos = await Order.findAll({
    where: {
      PaymentStatus: 'paid',
      ...(dateCondition ? { [Op.and]: [dateCondition] } : {})
    },
    attributes: ['TotalPrice']
  });

  const total = ingresos.reduce((sum, order) => sum + parseFloat(order.TotalPrice || 0), 0);
  return total;
};

export const contarOrdenesPagadas = async (range) => {
  const dateCondition = getRange(range);

  const count = await Order.count({
    where: {
      PaymentStatus: 'paid',
      ...(range !== 'all' && dateCondition ? { [Op.and]: [dateCondition] } : {})
    }
  });

  return count;
};

export const calcularCambioIngresos = async (range) => {
  const ahora = new Date();
  let rangoActualLiteral, rangoAnteriorLiteral;

  if (range === "30d") {
    rangoActualLiteral = getRange("30d");

    const hace60Dias = new Date(ahora);
    hace60Dias.setDate(hace60Dias.getDate() - 60);
    const hace30Dias = new Date(ahora);
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const from = toSqlDateTimeString(hace60Dias);
    const to = toSqlDateTimeString(hace30Dias);

    rangoAnteriorLiteral = literal(`[OrderDate] BETWEEN '${from}' AND '${to}'`);
  } else if (range === "7d") {
    rangoActualLiteral = getRange("7d");

    const hace14Dias = new Date(ahora);
    hace14Dias.setDate(hace14Dias.getDate() - 14);
    const hace7Dias = new Date(ahora);
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    const from = toSqlDateTimeString(hace14Dias);
    const to = toSqlDateTimeString(hace7Dias);

    rangoAnteriorLiteral = literal(`[OrderDate] BETWEEN '${from}' AND '${to}'`);
  } else {
    throw new Error("Solo se permiten rangos de 30d o 7d");
  }

  // ⛳️ PASAMOS customCondition como segundo argumento
  const actual = await sumarIngresosPagados(null, rangoActualLiteral);
  const anterior = await sumarIngresosPagados(null, rangoAnteriorLiteral);

  const change = anterior > 0 ? ((actual - anterior) / anterior) * 100 : 0;

  return parseFloat(change.toFixed(2));
};
