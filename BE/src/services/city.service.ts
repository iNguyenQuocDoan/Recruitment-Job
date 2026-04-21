import City from "../models/city.model";
import { ServiceResponse } from "./auth.service";

const listCitiesService = async (): Promise<ServiceResponse<any>> => {
  const cities = await City.find({});

  return {
    statusCode: 200,
    body: {
      code: "success",
      cityList: cities,
    },
  };
};

export { listCitiesService };
