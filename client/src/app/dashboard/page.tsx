"use client";
//layout of the page here
import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      <CardSalesSummary />
      <CardPurchaseSummary />
      <CardExpenseSummary />
      <StatCard
      title="Customer & Expenses"
      primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
      dateRange=""
      details={[
        {
          title: "Customer Growth",
          amount: "283.00",
          changePercentage: 141,
          IconComponent: TrendingUp,
        },
        {
          title: "Expenses",
          amount: "60.00",
          changePercentage: -68,
          IconComponent: TrendingDown,
        },
      ]}
    />

      <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange=""
        details={[
          {
            title: "Dues",
            amount: "250.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Orders",
            amount: "147.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange=""
        details={[
          {
            title: "Sales",
            amount: "2000.00",
            changePercentage: 40,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: "400.00",
            changePercentage: -20,
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div> 
  );
};

export default Dashboard;
