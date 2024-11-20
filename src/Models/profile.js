// Models/category.js
import prisma from "../Configs/connect.js";
import { getMaxPage } from "../Helpers/function.js";

export const get = async (req) => {
  try {
    const result = await prisma.profile.findMany({
      include: {
        Cashier: true,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getId = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.profile.findUnique({
      where: {
        id: id,
      },
      include: {
        Cashier: true,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const post = async (req) => {
  try {
    const {
      first_name,
      last_name,
      sex,
      dob,
      pob,
      address,
      phone,
      married,
      bio,
      userId,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;
    const result = await prisma.profile.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        sex: sex,
        dob: new Date(dob),
        pob: pob,
        address: address,
        phone: phone,
        married: Boolean(Number(married)),
        bio: bio,
        userId: Number(userId),
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const put = async (req) => {
  try {
    const {
      id,
      first_name,
      last_name,
      sex,
      dob,
      pob,
      address,
      phone,
      married,
      bio,
      userId,
      createdBy,
      lastUpdatedBy,
      objectVersionId,
    } = req.body;
    const result = await prisma.profile.update({
      where: {
        id: Number(id),
      },
      data: {
        first_name: first_name,
        last_name: last_name,
        sex: sex,
        dob: new Date(dob),
        pob: pob,
        address: address,
        phone: phone,
        married: Boolean(Number(married)),
        bio: bio,
        userId: Number(userId),
        createdBy: Number(createdBy),
        lastUpdatedBy: Number(lastUpdatedBy),
        objectVersionId: Number(objectVersionId),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const remove = async (req) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.profile.delete({
      where: {
        id: Number(id),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export default {
  get,
  getId,
  post,
  put,
  remove,
};
