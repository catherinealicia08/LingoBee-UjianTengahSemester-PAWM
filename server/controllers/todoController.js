import { supabase } from '../config/supabase.js';

// Get all todos for current user
export const getTodos = async (req, res) => {
  try {
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', req.user.id)
      .order('position', { ascending: true });

    if (error) throw error;

    res.json({ success: true, todos: todos || [] });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch todos' 
    });
  }
};

// Create new todo
export const createTodo = async (req, res) => {
  try {
    const { text, deadline } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Todo text is required' 
      });
    }

    // Get max position for new todo
    const { data: lastTodo } = await supabase
      .from('todos')
      .select('position')
      .eq('user_id', req.user.id)
      .order('position', { ascending: false })
      .limit(1)
      .single();

    const newPosition = lastTodo ? lastTodo.position + 1 : 0;

    const { data: newTodo, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: req.user.id,
          text: text.trim(),
          deadline: deadline || null,
          checked: false,
          position: newPosition
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'Todo created successfully',
      todo: newTodo 
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create todo' 
    });
  }
};

// Update todo (toggle checked or update text)
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, deadline, checked } = req.body;

    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (checked !== undefined) updateData.checked = checked;

    const { data: updatedTodo, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.id) // Ensure user owns this todo
      .select()
      .single();

    if (error) throw error;

    if (!updatedTodo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Todo not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Todo updated successfully',
      todo: updatedTodo 
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to update todo' 
    });
  }
};

// Reorder todos
export const reorderTodos = async (req, res) => {
  try {
    const { todos } = req.body; // Array of {id, position}

    if (!Array.isArray(todos)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid todos array' 
      });
    }

    // Update positions
    const updates = todos.map((todo, index) => 
      supabase
        .from('todos')
        .update({ position: index })
        .eq('id', todo.id)
        .eq('user_id', req.user.id)
    );

    await Promise.all(updates);

    res.json({ 
      success: true, 
      message: 'Todos reordered successfully' 
    });
  } catch (error) {
    console.error('Reorder todos error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to reorder todos' 
    });
  }
};

// Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id); // Ensure user owns this todo

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'Todo deleted successfully' 
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to delete todo' 
    });
  }
};