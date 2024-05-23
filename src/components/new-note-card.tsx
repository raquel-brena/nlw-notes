import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";
import { FormEvent, useState } from "react";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState("");

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);

    if (event.target.value.length === 0) {
      setShouldShowOnBoarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (content === "") {
      toast.warning("A nota não pode ser vazia.")
      return ;
    }
    onNoteCreated(content);
    setContent("");
    setShouldShowOnBoarding(true);
    toast.success("Nota salva com sucesso!");
  }

  function handleStartRecording() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast.warning('Infelizmente seu navegador não suporta a API de gravação!');
      return;
    }
    setIsRecording(true)
    setShouldShowOnBoarding(false)
    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true
    speechRecognition.interimResults = true
    speechRecognition.maxAlternatives = 1

    
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)}, '')

        setContent(transcription) 
    }

    speechRecognition.onerror = (event) => {
      console.log(event.error)
    }

    speechRecognition.start()

    setIsRecording(true);
  }

  function handleStopRecording() {
    speechRecognition?.stop()
    setIsRecording(false);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md bg-slate-700 gap-3 text-left p-5 flex flex-col">
        <span
          className="text-sm font-medium text-slate-200  hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2
        focus-visible:ring-lime-400"
        >
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota de áudio que será convertida para texto
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="overflow-hidden fixed md:left-1/2 inset-0 md:inset-auto md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 md:max-w-[640px] md:w-full h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400"
                  >
                    gravando uma nota
                  </button>{" "}
                  uma nota em áudio ou se preferir{" "}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400"
                  >
                    {" "}
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="w-full h-32 bg-transparent leading-6 text-slate-400 resize-none flex-1 outline-none"
                  placeholder="Digite sua nota aqui..."
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:text-slate-100 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse"></div>
                Gravando! Clique p/ interromper
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 hover:bg-lime-500 py-4 text-center text-sm text-lime-950 outline-none font-medium group"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
