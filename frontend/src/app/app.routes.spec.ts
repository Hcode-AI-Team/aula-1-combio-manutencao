import { routes } from './app.routes';
import { OrdensComponent } from './ordens/ordens.component';
import { OrdemDetalheComponent } from './ordens/ordem-detalhe.component';
import { RelatorioComponent } from './relatorio/relatorio.component';

describe('Rotas da aplicação', () => {
  it('redireciona a raiz para ordens', () => {
    expect(routes[0]).toEqual({
      path: '',
      redirectTo: 'ordens',
      pathMatch: 'full',
    });
  });

  it('mapeia cada caminho ao seu componente', () => {
    const porCaminho = new Map(routes.map((r) => [r.path, r.component]));

    expect(porCaminho.get('ordens')).toBe(OrdensComponent);
    expect(porCaminho.get('ordens/:id')).toBe(OrdemDetalheComponent);
    expect(porCaminho.get('relatorio')).toBe(RelatorioComponent);
  });
});
