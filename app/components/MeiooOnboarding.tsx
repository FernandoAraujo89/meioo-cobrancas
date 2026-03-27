"use client";

import { useEffect, useCallback } from "react";

const STORAGE_KEY = "meioo_tour_v7";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const steps: any[] = [
  {
    element: "#meioo-sidebar-btn",
    intro:
      "<strong>Bem-vindo à integração Meioo!</strong><br/><br/>Acesse sua Conta Digital diretamente do Avante Web — saldo, transações e cobranças em um só lugar.",
    position: "right",
  },
  {
    element: "#financeiro-nav-btn",
    intro:
      "<strong>Menu Financeiro.</strong><br/><br/>Clique aqui para expandir o módulo financeiro e acessar as funcionalidades integradas à Meioo.",
    position: "right",
  },
  {
    element: "#meioo-flyout-section",
    intro:
      "<strong>Conta Digital Meioo no Financeiro.</strong><br/><br/>Os menus <b>Contas a Receber</b>, <b>Contas a Pagar</b> e <b>Cobranças Bancárias</b> estão integrados diretamente à sua Conta Digital Meioo — gerencie tudo sem sair do Avante Web.",
    position: "right",
  },
  {
    element: "#btn-incluir-cobranca",
    intro:
      "<strong>Crie cobranças com um clique.</strong><br/><br/>Gere cobranças via <b>Pix</b>, <b>Boleto</b>, <b>Link de Pagamento</b> ou envie direto para a <b>maquininha</b> integrada.",
    position: "bottom",
  },
  {
    element: "#summary-cards",
    intro:
      "<strong>Visão financeira em tempo real.</strong><br/><br/>Acompanhe o total a receber, cobranças vencidas e recebimentos do mês sem sair do Avante Web.",
    position: "bottom",
  },
  {
    element: "#cobrancas-table",
    intro:
      "<strong>Histórico completo de cobranças.</strong><br/><br/>Todas as suas cobranças Meioo aparecem aqui automaticamente, com status e forma de pagamento atualizados.",
    position: "top",
  },
];

function openFinanceiroFlyout() {
  const btn = document.getElementById("financeiro-nav-btn") as HTMLButtonElement | null;
  btn?.click();
}

function closeFinanceiroFlyout() {
  const backdrop = document.querySelector(".fixed.inset-0.z-10") as HTMLElement | null;
  backdrop?.click();
}

export function useMeiooTour() {
  const startTour = useCallback(async () => {
    const introjs = (await import("intro.js")).default;

    const tour = introjs();
    tour.setOptions({
      steps,
      nextLabel: "Próximo →",
      prevLabel: "← Anterior",
      doneLabel: "Começar a usar!",
      skipLabel: "Pular tour",
      showBullets: true,
      showProgress: false,
      exitOnOverlayClick: false,
      tooltipClass: "avante-tooltip",
      highlightClass: "avante-highlight",
      scrollToElement: true,
      scrollPadding: 80,
    });

    // Step index 2 = #meioo-flyout-section (flyout must be open for the element to exist in DOM)
    const FLYOUT_STEP = 2;

    tour.onbeforechange((_target: Element, stepIndex: number): Promise<boolean> => {
      if (stepIndex === FLYOUT_STEP) {
        // Garante que o flyout não esteja já aberto antes de clicar
        closeFinanceiroFlyout();
        return new Promise((r) =>
          setTimeout(() => {
            openFinanceiroFlyout();
            // Aguarda o React renderizar o flyout no DOM (maior margem para Vercel)
            setTimeout(() => r(true), 700);
          }, 100)
        );
      }
      // Outros passos: fecha o flyout se estiver aberto
      closeFinanceiroFlyout();
      return Promise.resolve(true);
    });

    tour.oncomplete(() => {
      closeFinanceiroFlyout();
      localStorage.setItem(STORAGE_KEY, "1");
    });
    tour.onexit(() => {
      closeFinanceiroFlyout();
      localStorage.setItem(STORAGE_KEY, "1");
    });

    tour.start();
  }, []);

  return { startTour };
}

export function MeiooOnboarding() {
  const { startTour } = useMeiooTour();

  useEffect(() => {
    const alreadySeen = localStorage.getItem(STORAGE_KEY);
    if (alreadySeen) return;

    // Polling: aguarda o sidebar estar no DOM (até 8s, verifica a cada 500ms)
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const hasSidebar = !!document.getElementById("financeiro-nav-btn");
      if (hasSidebar) {
        clearInterval(interval);
        startTour();
      } else if (attempts >= 16) {
        clearInterval(interval); // desiste após 8s
      }
    }, 500);

    return () => clearInterval(interval);
  }, [startTour]);

  return null;
}
