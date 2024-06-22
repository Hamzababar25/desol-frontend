// import Promise from "promise";

class Utility {
  constructor() {
    this.BASE_URL = "https://desol-backend.onrender.com/";
  }

  convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
}
const utility = new Utility();
export default utility;
