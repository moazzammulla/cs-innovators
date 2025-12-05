/**
 * Example: Enhanced NGO Dashboard with AI Integration
 * This file shows how to integrate AI features into the NGO dashboard
 */

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import AIPriorityBadge from '../../components/ngo/AIPriorityBadge';
import RiskIndicator from '../../components/ngo/RiskIndicator';
import AIInsightsPanel from '../../components/ngo/AIInsightsPanel';
import { fetchNgoNearbySurplus } from '../../utils/api';
import {
  getNgoPickupRecommendations,
  assessPickupRisk,
  isAIServiceAvailable,
} from '../../utils/aiService';

const NgODashboardEnhanced = () => {
  const [surplusList, setSurplusList] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [riskAssessments, setRiskAssessments] = useState({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [sortBy, setSortBy] = useState('ai-priority'); // 'ai-priority', 'distance', 'deadline'

  // Mock NGO data (in real app, get from user profile/context)
  const ngoData = {
    location: 'City Center',
    capacity: 50, // portions
    preferences: {
      preferredFoodTypes: ['veg', 'non-veg'],
      maxDistance: 5, // km
    },
  };

  useEffect(() => {
    async function load() {
      const data = await fetchNgoNearbySurplus();
      setSurplusList(data);
    }
    load();
  }, []);

  // Load AI recommendations when surplus list changes
  useEffect(() => {
    async function loadAIRecommendations() {
      if (surplusList.length === 0 || !isAIServiceAvailable()) {
        setSortedItems(surplusList);
        return;
      }

      setIsLoadingAI(true);
      try {
        // Get AI recommendations
        const recommendations = await getNgoPickupRecommendations({
          availableSurplus: surplusList,
          ngoLocation: ngoData.location,
          ngoCapacity: ngoData.capacity,
          pastPickups: [], // In real app, fetch from API
        });
        setAiRecommendations(recommendations);

        // Get risk assessments for each item
        const risks = {};
        for (const item of surplusList) {
          try {
            const risk = await assessPickupRisk(item, {
              ngoLocation: ngoData.location,
              currentTime: new Date().toISOString(),
            });
            risks[item.id] = risk;
          } catch (error) {
            console.error(`Error assessing risk for item ${item.id}:`, error);
          }
        }
        setRiskAssessments(risks);

        // Sort items by AI priority
        const sorted = [...surplusList].sort((a, b) => {
          if (sortBy === 'ai-priority') {
            const aPriority =
              recommendations.prioritizedItems?.find((p) => p.id === a.id)?.priority || 0;
            const bPriority =
              recommendations.prioritizedItems?.find((p) => p.id === b.id)?.priority || 0;
            return bPriority - aPriority;
          } else if (sortBy === 'distance') {
            const aDist = parseFloat(a.distance) || 999;
            const bDist = parseFloat(b.distance) || 999;
            return aDist - bDist;
          } else if (sortBy === 'deadline') {
            // Sort by deadline urgency (simplified)
            return a.deadline.localeCompare(b.deadline);
          }
          return 0;
        });
        setSortedItems(sorted);
      } catch (error) {
        console.error('Error loading AI recommendations:', error);
        setSortedItems(surplusList);
      } finally {
        setIsLoadingAI(false);
      }
    }

    loadAIRecommendations();
  }, [surplusList, sortBy]);

  const handleAccept = (item) => {
    toast.success(`Pickup accepted for ${item.foodName} (mock)`);
  };

  const getItemPriority = (itemId) => {
    return (
      aiRecommendations?.prioritizedItems?.find((p) => p.id === itemId)?.priority || null
    );
  };

  const getItemRisk = (itemId) => {
    return riskAssessments[itemId]?.riskLevel || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-semibold text-secondary">NGO Dashboard</h1>
          <p className="text-xs text-gray-500">
            Browse nearby surplus food with AI-powered recommendations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ai-priority">Sort by AI Priority</option>
            <option value="distance">Sort by Distance</option>
            <option value="deadline">Sort by Deadline</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main Surplus List */}
        <div className="space-y-3 lg:col-span-2">
          {isLoadingAI && surplusList.length > 0 && (
            <div className="card flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2 text-xs text-gray-500">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>AI is analyzing pickups...</span>
              </div>
            </div>
          )}

          {sortedItems.map((item) => {
            const priority = getItemPriority(item.id);
            const risk = getItemRisk(item.id);
            const recommendation = aiRecommendations?.prioritizedItems?.find(
              (p) => p.id === item.id
            );

            return (
              <div
                key={item.id}
                className="card flex flex-col gap-3 border border-gray-50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-secondary">{item.foodName}</p>
                    {priority && <AIPriorityBadge priority={priority} />}
                    {risk && <RiskIndicator riskLevel={risk} />}
                  </div>
                  <p className="text-xs text-gray-500">{item.canteen}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                    <span>Qty: {item.quantity}</span>
                    <span>Distance: {item.distance}</span>
                    <span>Pickup by: {item.deadline}</span>
                    <StatusBadge status="Available" />
                  </div>
                  {recommendation?.reason && (
                    <p className="mt-2 text-[10px] text-gray-400">
                      💡 {recommendation.reason}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 text-xs md:items-end">
                  <Button size="sm" onClick={() => handleAccept(item)}>
                    ACCEPT PICKUP
                  </Button>
                  <p className="text-[11px] text-gray-400">AI-matched opportunity</p>
                </div>
              </div>
            );
          })}

          {sortedItems.length === 0 && !isLoadingAI && (
            <div className="card py-8 text-center text-xs text-gray-500">
              No surplus food available at the moment.
            </div>
          )}
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-4">
          <AIInsightsPanel recommendations={aiRecommendations} isLoading={isLoadingAI} />

          {/* Map View Placeholder */}
          <div className="card">
            <p className="mb-2 text-xs font-medium text-secondary">Map View (Placeholder)</p>
            <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 text-[11px] text-primary">
              Interactive map coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgODashboardEnhanced;
