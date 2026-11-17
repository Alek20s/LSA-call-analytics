
import React, { useEffect, useState } from 'react';
import { fetchCalls } from './api.js';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from './components/ui/card.jsx';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from './components/ui/table.jsx';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const h = React.createElement;

  useEffect(() => {
    fetchCalls()
      .then(data => {
        console.log(
          'Call status values:',
          [...new Set(data.map(call =>
            `${typeof call.callStatus}: ${String(call.callStatus)}`
          ))]
        );

        console.log('First API record:', data[0]);

        setCalls(data);
      })
      .catch(() => setError('Failed to load call records'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return h('p', null, 'Loading...');
  if (error) return h('p', null, error);

  // Convert API status values into booleans
  const getStatus = value => {
    if (value === true || value === 1) return true;
    if (value === false || value === 0) return false;

    if (typeof value === 'string') {
      const status = value.toLowerCase().trim();

      if (['true', '1', 'success', 'successful'].includes(status)) {
        return true;
      }

      if (['false', '0', 'failed', 'unsuccessful'].includes(status)) {
        return false;
      }
    }

    return null;
  };

  // KPI calculations
  const totalCalls = calls.length;

  const totalCost = calls.reduce(
    (sum, call) => sum + Number(call.callCost || 0), 0
  );

  const averageCost = totalCalls ? totalCost / totalCalls : 0;

  const durations = calls.map(
    call => Number(call.callDuration || 0)
  );

  const averageDuration = totalCalls
    ? durations.reduce((sum, value) => sum + value, 0) / totalCalls
    : 0;

  const longestCall = durations.length ? Math.max(...durations) : 0;
  const shortestCall = durations.length ? Math.min(...durations) : 0;

  const successfulCalls = calls.filter(
    call => getStatus(call.callStatus) === true
  ).length;

  const failedCalls = calls.filter(
    call => getStatus(call.callStatus) === false
  ).length;

  const unknownStatusCalls = calls.filter(
    call => getStatus(call.callStatus) === null
  ).length;

  console.log('Successful:', successfulCalls);
  console.log('Failed:', failedCalls);
  console.log('Unrecognised status:', unknownStatusCalls);

  const metrics = [
    ['Total Calls', totalCalls],
    ['Total Call Cost', '$' + totalCost.toFixed(2)],
    ['Average Duration', Math.round(averageDuration) + ' s'],
    ['Successful Calls', successfulCalls],
    ['Failed Calls', failedCalls]
  ];

  // Duration analytics
  const durationData = [
    { name: 'Shortest', seconds: shortestCall },
    { name: 'Average', seconds: Math.round(averageDuration) },
    { name: 'Longest', seconds: longestCall }
  ];

  // Group costs by city
  const cityCosts = {};

  calls.forEach(call => {
    const city = call.city || 'Unknown';
    cityCosts[city] = (cityCosts[city] || 0) +
      Number(call.callCost || 0);
  });

  const costData = Object.entries(cityCosts).map(
    ([city, cost]) => ({
      city,
      cost: Number(cost.toFixed(2))
    })
  );

  // Calls by hour
  const hourlyCalls = {};

  calls.forEach(call => {
    const date = new Date(call.callStartTime);

    if (!Number.isNaN(date.getTime())) {
      const hour = String(date.getHours()).padStart(2, '0') + ':00';
      hourlyCalls[hour] = (hourlyCalls[hour] || 0) + 1;
    }
  });

  const activityData = Object.entries(hourlyCalls)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, count]) => ({
      hour,
      calls: count
    }));

  // Calls by city
  const cityCalls = {};

  calls.forEach(call => {
    const city = call.city || 'Unknown';
    cityCalls[city] = (cityCalls[city] || 0) + 1;
  });

  const cityCallData = Object.entries(cityCalls)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  // Recent calls
  const recentCalls = [...calls]
    .sort((a, b) =>
      new Date(b.callStartTime).getTime() -
      new Date(a.callStartTime).getTime()
    )
    .slice(0, 10);

  const formatDate = value => {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? 'Unknown'
      : date.toLocaleString();
  };

  const section = (title, children) =>
    h('section',
      { className: 'bg-white rounded-lg shadow p-6 mb-8' },
      h('h2', { className: 'text-xl font-bold mb-6' }, title),
      children
    );

  return h('main',
    { className: 'min-h-screen bg-gray-100 p-8' },

    h('h1',
      { className: 'text-3xl font-bold mb-2' },
      'Call Analytics Dashboard'
    ),

    h('p',
      { className: 'text-gray-500 mb-8' },
      'Analysis of call records and performance'
    ),

    // KPI cards
    h('div',
      { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8' },

      ...metrics.map(([label, value]) =>
        h(Card,
          { key: label },
          h(CardHeader, null,
            h(CardTitle,
              { className: 'text-sm font-medium text-gray-500' },
              label
            )
          ),
          h(CardContent, null,
            h('p',
              { className: 'text-2xl font-bold' },
              value
            )
          )
        )
      )
    ),

    // Duration analytics
    section('Call Duration Analytics',
      h(React.Fragment, null,

        h('div',
          { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6' },

          ...[
            ['Shortest Call', shortestCall + ' s'],
            ['Average Duration', Math.round(averageDuration) + ' s'],
            ['Longest Call', longestCall + ' s']
          ].map(([label, value]) =>
            h('div',
              { key: label, className: 'bg-gray-50 rounded-lg p-4' },
              h('p', { className: 'text-gray-500 text-sm' }, label),
              h('p', { className: 'text-2xl font-bold mt-2' }, value)
            )
          )
        ),

        h('div', { style: { width: '100%', height: 300 } },
          h(ResponsiveContainer, { width: '100%', height: '100%' },
            h(BarChart, { data: durationData },
              h(XAxis, { dataKey: 'name' }),
              h(YAxis, { unit: ' s' }),
              h(Tooltip),
              h(Bar, {
                dataKey: 'seconds',
                fill: '#6366f1',
                radius: [5, 5, 0, 0]
              })
            )
          )
        )
      )
    ),

    // Activity timeline
    section('Call Activity Timeline',
      h('div', { style: { width: '100%', height: 350 } },
        h(ResponsiveContainer, { width: '100%', height: '100%' },
          h(LineChart, { data: activityData },
            h(CartesianGrid, { strokeDasharray: '3 3' }),
            h(XAxis, { dataKey: 'hour' }),
            h(YAxis, { allowDecimals: false }),
            h(Tooltip),
            h(Line, {
              type: 'monotone',
              dataKey: 'calls',
              stroke: '#6366f1',
              strokeWidth: 2
            })
          )
        )
      )
    ),

    // Calls by city
    section('Calls by City',
      h('div', { style: { width: '100%', height: 450 } },
        h(ResponsiveContainer, { width: '100%', height: '100%' },
          h(BarChart,
            {
              data: cityCallData,
              layout: 'vertical',
              margin: { left: 30, right: 20 }
            },
            h(CartesianGrid, { strokeDasharray: '3 3' }),
            h(XAxis, { type: 'number', allowDecimals: false }),
            h(YAxis, {
              type: 'category',
              dataKey: 'city',
              width: 130
            }),
            h(Tooltip),
            h(Bar, { dataKey: 'count', fill: '#10b981' })
          )
        )
      )
    ),

    // Cost analytics
    section('Call Cost Analytics',
      h(React.Fragment, null,

        h('div', { className: 'bg-gray-50 rounded-lg p-4 mb-6' },
          h('p', { className: 'text-gray-500 text-sm' },
            'Average Cost per Call'
          ),
          h('p', { className: 'text-2xl font-bold mt-2' },
            '$' + averageCost.toFixed(2)
          )
        ),

        h('h3', { className: 'font-semibold mb-4' },
          'Total Cost by City'
        ),

        h('div', { style: { width: '100%', height: 350 } },
          h(ResponsiveContainer, { width: '100%', height: '100%' },
            h(BarChart, { data: costData },
              h(XAxis, { dataKey: 'city' }),
              h(YAxis, {}),
              h(Tooltip, {
                formatter: value => '$' + Number(value).toFixed(2)
              }),
              h(Bar, {
                dataKey: 'cost',
                fill: '#3b82f6',
                radius: [5, 5, 0, 0]
              })
            )
          )
        )
      )
    ),

    // Recent call logs
    section('Recent Call Logs',
      h('div',
        { className: 'overflow-x-auto' },

        h(Table, null,

          h(TableHeader, null,
            h(TableRow, null,
              ...[
                'Caller Name',
                'Caller Number',
                'Receiver Number',
                'City',
                'Duration',
                'Cost',
                'Start Time'
              ].map(label =>
                h(TableHead, { key: label }, label)
              )
            )
          ),

          h(TableBody, null,

            ...recentCalls.map(call =>
              h(TableRow,
                { key: call.id },

                h(TableCell, null, call.callerName || 'Unknown'),
                h(TableCell, null, call.callerNumber || 'Unknown'),
                h(TableCell, null, call.receiverNumber || 'Unknown'),
                h(TableCell, null, call.city || 'Unknown'),
                h(TableCell, null,
                  Number(call.callDuration || 0) + ' s'
                ),
                h(TableCell, null,
                  '$' + Number(call.callCost || 0).toFixed(2)
                ),
                h(TableCell, null,
                  formatDate(call.callStartTime)
                )
              )
            )
          )
        )
      )
    )
  );
}

export default Dashboard;
