"use client";

import { useEffect, useCallback } from "react";

const STORAGE_KEY = "meioo_tour_done";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const steps: any[] = [
  {
    element: "#meioo-sidebar-btn",
    intro:
      "<strong>Bem-vindo à integração Meioo!</strong><br/><br/>Aqui você acessa sua Conta Digital diretamente do Avante Web — saldo, transações e muito mais.",
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

    tour.oncomplete(() => {
      localStorage.setItem(STORAGE_KEY, "1");
    });
    tour.onexit(() => {
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

    // Small delay to let the page fully render before highlighting elements
    const timer = setTimeout(() => {
      startTour();
    }, 800);

    return () => clearTimeout(timer);
  }, [startTour]);

  return null;
}
