import { ToastMessageService } from "src/app/components/message/service/toast-message.service";

export function handleErrors(error:any, toastMessageService:any){
    
    if(error.error.response){
        toastMessageService.showMessage(
            'danger',
            error.error.response
          )
    }else{
        toastMessageService.showMessage(
            'danger',
            'Error en el servidor, intente mas tarde.'
          )
    }
}