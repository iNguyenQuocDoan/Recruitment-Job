import City from "../models/city.model";
import { ServiceResponse } from "../interfaces/request.interface";
import { STATUS_CODE, RESPONSE_CODE } from "../constants/http.constant";

const listCitiesService = async (): Promise<ServiceResponse<any>> => {
  const cities = await City.find({});

  return {
    statusCode: STATUS_CODE.OK,
    body: {
      code: RESPONSE_CODE.SUCCESS,
      cityList: cities,
    },
  };
};

export { listCitiesService };
