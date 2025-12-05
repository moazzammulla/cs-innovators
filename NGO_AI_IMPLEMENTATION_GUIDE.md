# NGO Dashboard AI Implementation Guide

This guide shows you how to integrate AI features into your NGO dashboard.

## 📦 What's Included

### 1. **AI Service Functions** (`src/utils/aiService.js`)
- ✅ `getNgoPickupRecommendations()` - Smart prioritization
- ✅ `assessPickupRisk()` - Risk assessment (NEW)
- ✅ `optimizePickupRoute()` - Route optimization (NEW)
- ✅ `getAnalyticsInsights()` - Analytics insights

### 2. **UI Components** (`src/components/ngo/`)
- ✅ `AIPriorityBadge.jsx` - Shows AI priority score (1-10)
- ✅ `RiskIndicator.jsx` - Shows risk level (Low/Medium/High)
- ✅ `AIInsightsPanel.jsx` - Displays AI recommendations sidebar

### 3. **Example Implementation** (`src/pages/dashboards/NgODashboard.example.jsx`)
- Complete example showing how to integrate all AI features

## 🚀 Quick Start

### Step 1: Copy Components
The components are already created. You can use them directly:

```javascript
import AIPriorityBadge from '../../components/ngo/AIPriorityBadge';
import RiskIndicator from '../../components/ngo/RiskIndicator';
import AIInsightsPanel from '../../components/ngo/AIInsightsPanel';
```

### Step 2: Integrate into NgODashboard.jsx

**Basic Integration (Minimal Changes):**

```javascript
import { getNgoPickupRecommendations, isAIServiceAvailable } from '../../utils/aiService';

// Add state
const [aiRecommendations, setAiRecommendations] = useState(null);
const [isLoadingAI, setIsLoadingAI] = useState(false);

// Load AI recommendations
useEffect(() => {
  async function loadAI() {
    if (surplusList.length === 0 || !isAIServiceAvailable()) return;
    
    setIsLoadingAI(true);
    try {
      const recommendations = await getNgoPickupRecommendations({
        availableSurplus: surplusList,
        ngoLocation: 'City Center', // Get from user profile
        ngoCapacity: 50,
        pastPickups: [],
      });
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsLoadingAI(false);
    }
  }
  loadAI();
}, [surplusList]);
```

### Step 3: Display AI Priority in Items

```javascript
// In your item rendering
{surplusList.map((item) => {
  const priority = aiRecommendations?.prioritizedItems?.find(p => p.id === item.id)?.priority;
  
  return (
    <div key={item.id}>
      {/* Your existing item content */}
      {priority && <AIPriorityBadge priority={priority} />}
    </div>
  );
})}
```

### Step 4: Add AI Insights Panel

```javascript
// In your sidebar
<AIInsightsPanel 
  recommendations={aiRecommendations} 
  isLoading={isLoadingAI} 
/>
```

## 🎯 Feature Implementation Priority

### Phase 1: Basic AI Integration (30 minutes)
1. ✅ Add `getNgoPickupRecommendations()` call
2. ✅ Display AI priority badges
3. ✅ Show AI insights panel
4. ✅ Sort items by AI priority

### Phase 2: Risk Assessment (1 hour)
1. ✅ Add `assessPickupRisk()` for each item
2. ✅ Display risk indicators
3. ✅ Show risk warnings in UI

### Phase 3: Route Optimization (2 hours)
1. ✅ Add multi-select for items
2. ✅ Call `optimizePickupRoute()` when multiple selected
3. ✅ Display optimized route
4. ✅ Add "Accept Batch" functionality

## 💡 Usage Examples

### Example 1: Sort by AI Priority

```javascript
const sortedItems = [...surplusList].sort((a, b) => {
  const aPriority = aiRecommendations?.prioritizedItems?.find(p => p.id === a.id)?.priority || 0;
  const bPriority = aiRecommendations?.prioritizedItems?.find(p => p.id === b.id)?.priority || 0;
  return bPriority - aPriority;
});
```

### Example 2: Filter High Priority Items

```javascript
const highPriorityItems = surplusList.filter(item => {
  const priority = aiRecommendations?.prioritizedItems?.find(p => p.id === item.id)?.priority;
  return priority >= 8;
});
```

### Example 3: Route Optimization

```javascript
const selectedItems = [item1, item2, item3]; // User selected items

const route = await optimizePickupRoute({
  ngoLocation: 'City Center',
  pickupLocations: selectedItems.map(item => ({
    id: item.id,
    location: item.canteen,
    deadline: item.deadline,
    item: item
  })),
  currentTime: new Date().toISOString()
});

// Display route.optimalRoute with order and estimated times
```

## 🎨 UI Enhancements

### Add Sort Dropdown
```javascript
<select onChange={(e) => setSortBy(e.target.value)}>
  <option value="ai-priority">AI Priority</option>
  <option value="distance">Distance</option>
  <option value="deadline">Deadline</option>
</select>
```

### Add Loading State
```javascript
{isLoadingAI && (
  <div className="flex items-center gap-2">
    <Spinner />
    <span>AI is analyzing...</span>
  </div>
)}
```

### Add AI Toggle
```javascript
const [enableAI, setEnableAI] = useState(true);

<label>
  <input 
    type="checkbox" 
    checked={enableAI} 
    onChange={(e) => setEnableAI(e.target.checked)} 
  />
  Enable AI Recommendations
</label>
```

## 🔧 Configuration

### Get NGO Data from Context/Profile

```javascript
// In real app, get from user context or API
const ngoProfile = {
  location: userProfile.location,
  capacity: userProfile.capacity,
  preferences: userProfile.preferences,
  pastPickups: await fetchPickupHistory(userId)
};
```

### Error Handling

```javascript
try {
  const recommendations = await getNgoPickupRecommendations(context);
  setAiRecommendations(recommendations);
} catch (error) {
  console.error('AI service error:', error);
  // Fallback to basic sorting
  setSortedItems([...surplusList].sort((a, b) => 
    parseFloat(a.distance) - parseFloat(b.distance)
  ));
}
```

## 📊 Data Flow

```
1. User opens NGO Dashboard
   ↓
2. Fetch surplus list from API
   ↓
3. Call getNgoPickupRecommendations() with surplus data
   ↓
4. AI analyzes and returns prioritized items
   ↓
5. Display items sorted by AI priority
   ↓
6. Show AI insights panel with recommendations
   ↓
7. User can accept pickups based on AI suggestions
```

## 🚨 Important Notes

1. **API Key Required**: Make sure `VITE_GEMINI_API_KEY` is set in `.env`
2. **Performance**: AI calls may take 2-5 seconds. Show loading states.
3. **Fallback**: Always have fallback sorting if AI is unavailable
4. **Caching**: Consider caching AI recommendations for 5 minutes
5. **Rate Limits**: Be aware of Gemini API rate limits

## 🎓 Next Steps

1. Review `NgODashboard.example.jsx` for complete implementation
2. Copy relevant parts to your `NgODashboard.jsx`
3. Customize UI components to match your design
4. Add more AI features as needed (see `NGO_AI_SUGGESTIONS.md`)

## 📚 Related Files

- `src/utils/aiService.js` - AI service functions
- `src/components/ngo/` - AI UI components
- `src/pages/dashboards/NgODashboard.example.jsx` - Full example
- `NGO_AI_SUGGESTIONS.md` - More AI feature ideas
