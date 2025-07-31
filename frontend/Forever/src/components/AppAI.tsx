'use client';
import {
  AIInput,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from '@/components/ui/shadcn-io/ai/input';
import { type FormEventHandler, useState } from 'react';
const models = [
  { id: 'tongyi', name: '通义千问' },
];
const Example = () => {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>(models[0].id);
  const [status, setStatus] = useState<
    'submitted' | 'streaming' | 'ready' | 'error'
  >('ready');
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!text) {
      return;
    }
    setStatus('submitted');
    setTimeout(() => {
      setStatus('streaming');
    }, 200);
    setTimeout(() => {
      setStatus('ready');
    }, 2000);
  };
  return (
    <AIInput onSubmit={handleSubmit}>
      <AIInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
      <AIInputToolbar>
        <AIInputTools>
          <AIInputModelSelect onValueChange={setModel} value={model}>
            <AIInputModelSelectTrigger>
              <AIInputModelSelectValue />
            </AIInputModelSelectTrigger>
            <AIInputModelSelectContent>
              {models.map((model) => (
                <AIInputModelSelectItem key={model.id}value={model.id}>
                  {model.name}
                </AIInputModelSelectItem>
              ))}
            </AIInputModelSelectContent>
          </AIInputModelSelect>
        </AIInputTools>
        <AIInputSubmit disabled={!text} status={status} />
      </AIInputToolbar>
    </AIInput>
  );
};
export default Example;
