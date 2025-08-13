interface StudyHeaderProps {
  current: number;
  total: number;
}

export function StudyHeader({ current, total }: StudyHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">Questão {current} de {total}</h1>
      
      {/* Aqui podemos adicionar uma barra de progresso no futuro */}
    
    </div>
); }