import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";

export function NewNoteCard(){
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true) 

  function handleStartEditor(){
    setShouldShowOnBoarding(false)
  }


  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>){
    if (event.target.value.length === 0){
      setShouldShowOnBoarding(true)
    }
  }
    return (
        <Dialog.Root>

        <Dialog.Trigger className="rounded-md bg-slate-700 gap-3 text-left p-5 flex flex-col">
          <span className="text-sm font-medium text-slate-200  hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2
        focus-visible:ring-lime-400">
            Adicionar nota
          </span>
          <p className="text-sm leading-6 text-slate-400">
            Grave uma nota de áudio que será convertida para texto
          </p>
        </Dialog.Trigger>

        <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="overflow-hidden fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5"/>
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
             Adicionar nota
            </span>
           {shouldShowOnBoarding ? (
             <p className="text-sm leading-6 text-slate-400">
             Comece <button className="font-medium text-lime-400">gravando uma nota</button> uma nota em áudio ou se preferir <button 
             onClick={handleStartEditor}
             className="font-medium text-lime-400"> utilize apenas texto</button>.
             </p>
           ) : (
              <textarea
              autoFocus
              className="w-full h-32 bg-transparent leading-6 text-slate-400 resize-none flex-1 outline-none"
              placeholder="Digite sua nota aqui..."
              onChange={handleContentChange}
              />
            
           )}
          </div>

          <button
            type="button"
            className="w-full bg-lime-400 hover:bg-lime-500 py-4 text-center text-sm text-lime-950 outline-none font-medium group"
          >
           
              Salvar nota
            
          </button>
        </Dialog.Content>
      </Dialog.Portal>
        </Dialog.Root>
    );
}